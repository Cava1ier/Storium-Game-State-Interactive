
import { BaseRecord } from '../types';

class Columns {
  constructor(public names: string[]) {}

  getIndex(name: string): number {
    return this.names.indexOf(name);
  }
}

class Row {
  constructor(public data: any[]) {}
}

class Rows {
  private data: Row[] = [];
  private nextId = 1;
  private uniqueMaps: Map<string, number>[] = [];

  constructor(private table: Table) {
      this.uniqueMaps = table.unique.map(() => new Map());
  }
  
  private getUniqueKey(rowData: any[], uniqueIndex: number): string {
    const uniqueCols = this.table.unique[uniqueIndex];
    return uniqueCols.map(col => rowData[this.table.columns.getIndex(col)]).join('::');
  }

  add(rowData: { [key: string]: any }): number {
    const arr = new Array(this.table.columns.names.length).fill(null);
    for (const key in rowData) {
      const idx = this.table.columns.getIndex(key);
      if (idx > -1) arr[idx] = rowData[key];
    }
    
    // Use provided ID if it exists, otherwise generate one.
    if (rowData.id !== undefined && rowData.id !== null) {
        arr[0] = Number(rowData.id);
        this.nextId = Math.max(this.nextId, Number(rowData.id) + 1);
    } else {
        arr[0] = this.nextId++;
    }

    for (let i = 0; i < this.table.unique.length; i++) {
        const key = this.getUniqueKey(arr, i);
        if (this.uniqueMaps[i].has(key)) {
            console.warn(`Unique constraint violation on ${this.table.name} for key: ${key}`);
            return -1; // Indicate failure
        }
        this.uniqueMaps[i].set(key, arr[0]);
    }

    const row = new Row(arr);
    this.data.push(row);
    return arr[0];
  }

  get(id: number): Row | undefined {
    return this.data.find(r => r.data[0] === id);
  }

  update(id: number, updates: { [key: string]: any }): void {
    const row = this.get(id);
    if (!row) return;

    for (const key in updates) {
      const idx = this.table.columns.getIndex(key);
      if (idx > 0) { // can't update id
        row.data[idx] = updates[key];
      }
    }
  }

  delete(id: number): void {
    this.data = this.data.filter(r => r.data[0] !== id);
  }

  find(filter: { [key: string]: any }): Row[] {
    if (Object.keys(filter).length === 0) {
        return [...this.data];
    }
    return this.data.filter(r => {
      for (const key in filter) {
        const idx = this.table.columns.getIndex(key);
        if (idx > -1 && r.data[idx] !== filter[key]) return false;
      }
      return true;
    });
  }

  clear(): void {
      this.data = [];
      this.nextId = 1;
      this.uniqueMaps.forEach(map => map.clear());
  }
}

class Rowset {
  constructor(public columns: Columns, public rows: Row[]) {}

  toArray(): any[][] {
    return this.rows.map(row => row.data);
  }
}

class Table {
  public columns: Columns;
  public rows: Rows;

  constructor(public name: string, columnNames: string[], public unique: string[][] = []) {
    if (columnNames.length > 0 && columnNames[0] !== 'id') {
      columnNames.unshift('id');
    }
    this.columns = new Columns(columnNames);
    this.rows = new Rows(this);
  }
}

class Tables {
  private tables: { [key: string]: Table } = {};

  addTable(name: string, columns: string[], unique: string[][] = []): Table {
    if (this.tables[name]) {
        this.tables[name].rows.clear();
        return this.tables[name];
    }
    const table = new Table(name, columns, unique);
    this.tables[name] = table;
    return table;
  }

  getTable(name: string): Table | undefined {
    return this.tables[name];
  }
  
  getAllTables(): { [key: string]: Table } {
      return this.tables;
  }
}

export class Database {
  public tables = new Tables();

  create(tableName: string, rowData: { [key: string]: any }): number {
    const table = this.tables.getTable(tableName);
    if (!table) throw new Error(`Table ${tableName} not found`);
    return table.rows.add(rowData);
  }

  read(tableName: string, filter: { [key: string]: any } = {}): Rowset {
    const table = this.tables.getTable(tableName);
    if (!table) throw new Error(`Table ${tableName} not found`);
    const rows = table.rows.find(filter);
    return new Rowset(table.columns, rows);
  }

  update(tableName: string, id: number, updates: { [key: string]: any }): void {
    const table = this.tables.getTable(tableName);
    if (!table) throw new Error(`Table ${tableName} not found`);
    table.rows.update(id, updates);
  }

  delete(tableName: string, id: number): void {
    const table = this.tables.getTable(tableName);
    if (!table) throw new Error(`Table ${tableName} not found`);
    table.rows.delete(id);
  }

  clearAllTables(): void {
    const allTables = this.tables.getAllTables();
    for (const tableName in allTables) {
      if (Object.prototype.hasOwnProperty.call(allTables, tableName)) {
        allTables[tableName].rows.clear();
      }
    }
  }
}

export class DatabaseDriver {
  private database = new Database();

  getDatabase(): Database {
    return this.database;
  }

  loadFromText(text: string): void {
    this.database.clearAllTables();
    
    const lines = text.split('\n');
    let currentTable: Table | null = null;
    let columns: string[] = [];

    for (let line of lines) {
      line = line.trim();
      if (line === '' || line.startsWith('//')) {
        currentTable = null;
        continue;
      }

      if (line.startsWith('tbl') && line.includes(':')) {
        const parts = line.split(':', 2);
        const tableName = parts[0];
        columns = parts[1].split('|').map(c => c.trim().replace(/#|\s/g, ''));
        currentTable = this.database.tables.addTable(tableName, columns);
        continue;
      }

      if (currentTable) {
        const values = line.split('|').map(v => v.trim());
        const rowData: { [key: string]: any } = {};
        for (let i = 0; i < columns.length; i++) {
          const colName = columns[i];
          const value = values[i];
          const numValue = Number(value);
          rowData[colName] = !isNaN(numValue) && value.trim() !== '' ? numValue : value;
        }
        currentTable.rows.add(rowData);
      }
    }
  }
}

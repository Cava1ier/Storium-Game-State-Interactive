
import { Database } from './database';
import { BaseRecord } from '../types';

interface TableMeta {
  primaryKey: string;
  fields: string[];
  foreignKeys: Map<string, string>;
  displayField: string | null;
}

export class GrokCrud {
  private metadata = new Map<string, TableMeta>();

  constructor(private db: Database) {}

  define(tableName: string, meta: Partial<TableMeta> & { fields: string[] }) {
    const enhancedMeta: TableMeta = {
      primaryKey: meta.primaryKey || 'id',
      fields: meta.fields,
      foreignKeys: meta.foreignKeys || new Map(),
      displayField: meta.displayField || null,
    };
    this.metadata.set(tableName, enhancedMeta);
    this.db.tables.addTable(tableName, enhancedMeta.fields);
  }

  private rowToObject<T extends BaseRecord>(tableName: string, arr: any[]): T {
    const table = this.db.tables.getTable(tableName);
    if (!table) throw new Error(`Table not found: ${tableName}`);
    return table.columns.names.reduce((obj, name, index) => {
      obj[name] = arr[index];
      return obj;
    }, {} as { [key: string]: any }) as T;
  }

  create<T extends BaseRecord>(tableName: string, obj: Omit<T, 'id'>): T {
    const newId = this.db.create(tableName, obj);
    const newRecord = this.get<T>(tableName, newId);
    if (!newRecord) throw new Error("Failed to create record");
    return newRecord;
  }
  
  readAll<T extends BaseRecord>(tableName: string, filter: { [key: string]: any } = {}): T[] {
    const rowset = this.db.read(tableName, filter);
    return rowset.toArray().map(arr => this.rowToObject<T>(tableName, arr));
  }
  
  get<T extends BaseRecord>(tableName: string, id: number): T | null {
    const results = this.readAll<T>(tableName, { id });
    return results.length > 0 ? results[0] : null;
  }
  
  update<T extends BaseRecord>(tableName: string, id: number, updates: Partial<T>): void {
    this.db.update(tableName, id, updates);
  }
  
  delete(tableName: string, id: number): void {
    this.db.delete(tableName, id);
  }

  buildRawData(): string {
    const allTables = this.db.tables.getAllTables();
    let rawData = '';

    for (const tableName in allTables) {
        if (Object.prototype.hasOwnProperty.call(allTables, tableName)) {
            const table = allTables[tableName];
            const columns = table.columns.names;
            const rows = this.readAll(tableName);

            if (rows.length > 0) {
                rawData += `${tableName}:${columns.join('|')}\n`;
                rows.forEach(row => {
                    const values = columns.map(col => row[col] ?? '');
                    rawData += values.join('|') + '\n';
                });
                rawData += '\n';
            }
        }
    }
    return rawData.trim();
  }
}

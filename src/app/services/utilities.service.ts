import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { apiGenericModel } from '../model/Generic';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor(private titleService: Title) {}

  /**
   * This method will use to export into excel
   * @param tableId Table id
   * @param name table name
   */
  exportToExcel(tableId: string, name?: string) {
    let timeSpan = new Date().toISOString();
    let prefix = name || 'ExportResult';
    let fileName = `${prefix}-${timeSpan}`;
    let targetTableElm = document.getElementById(tableId);
    if (targetTableElm != null) {
      let wb = XLSX.utils.table_to_book(targetTableElm, <XLSX.Table2SheetOpts>{
        sheet: prefix,
      });
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    }
  }

  /**
   * This method will use to set page name
   * @param newTitle page time name
   */
  setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }

  /**
   * This method will use for generics item finds
   * @param items your required id
   * @param itemId your list of objects
   * @returns
   */
  getGenericName(items: apiGenericModel[], itemId: number): string {
    const selectedGroup = items.find((group) => group.id === itemId);
    return selectedGroup ? selectedGroup.name : '';
  }
  /**
   * This is the generic method for date conversion
   * @param date {string} date wanted to be coverted
   * @returns
   */
  convertToMySQLDate(date: string): string {
    // Convert MM/DD/YYYY format to YYYY-MM-DD
    const [month, day, year] = date.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }
}

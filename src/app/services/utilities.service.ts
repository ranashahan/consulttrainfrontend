import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as XLSX from 'xlsx';
import { apiGenericModel } from '../model/Generic';
import { AbstractControl } from '@angular/forms';

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
  public exportToExcel(tableId: string, name?: string) {
    let timeSpan = new Date().toISOString();
    let prefix = name || 'ExportResult';
    let fileName = `${prefix}-${timeSpan}`;
    let targetTableElm = document.getElementById(tableId);

    if (targetTableElm) {
      // Clone the table to avoid modifying the original table in the DOM
      let clonedTable = targetTableElm.cloneNode(true) as HTMLElement;

      // Remove the "action" column (assuming it's the last column)
      this.removeColumn(clonedTable, 'Action'); // Call a helper function to remove the action column

      let wb = XLSX.utils.table_to_book(clonedTable, <XLSX.Table2SheetOpts>{
        sheet: prefix,
      });
      XLSX.writeFile(wb, `${fileName}.xlsx`);
    }
  }

  /**
   * Private method only for export utility
   * @param table
   * @param headerName
   * @returns clone workbook
   */
  private removeColumn(table: HTMLElement, headerName: string): void {
    const headerCells = table.querySelectorAll('th');
    let columnIndex = -1;

    // Find the index of the column with the specified header name
    headerCells.forEach((th, index) => {
      if (th.textContent?.trim() === headerName) {
        columnIndex = index;
      }
    });

    if (columnIndex === -1) return; // If the column doesn't exist, exit

    // Remove the header cell
    headerCells[columnIndex]?.parentElement?.removeChild(
      headerCells[columnIndex]
    );

    // Remove the corresponding cells in each row
    const rows = table.querySelectorAll('tr');
    rows.forEach((row) => {
      const cells = row.querySelectorAll('td');
      if (cells[columnIndex]) {
        cells[columnIndex].parentElement?.removeChild(cells[columnIndex]);
      }
    });
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

  roles(): string[] {
    return ['admin', 'guest', 'member', 'manager', 'staff'];
  }

  formatValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) {
      return null; // No validation needed if the field is empty
    }

    const formatRegex = /^\d{5}-\d{7}-\d{1}$/;
    return formatRegex.test(value) ? null : { invalidFormat: true };
  }
}


import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { Student } from '../models/student.class';
import { Parentt } from '../models/parent.class';

@Injectable({
  providedIn: 'root'
})

export class ExcelService {
  constructor() { }

/*   readExcelFile(file: File | undefined): Promise<any> {


    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const students = XLSX.utils.sheet_to_json(sheet, { raw: false });

        resolve(students);
      };
      if (file)
        fileReader.readAsArrayBuffer(file);
    });
  }
 */

  readExcelFile(file: File | undefined): Promise<Student[]> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const studentsData = XLSX.utils.sheet_to_json(sheet, { raw: false });
      
        const students: Student[] = studentsData.map((row: any) => ({
           St_code:1 ,
         St_ID:row.A ,
         St_gender: 1,
         St_name: row['B'],
         St_Fname:row[2] ,
         St_image:"" ,
         St_birthday: "",
         St_father_code:1 ,
         St_mother_code:1 ,
         St_city_code:1 ,
         St_address: "",
         St_cell_phone: "",
         St_phone:row[3] ,
         St_email:"" ,
         St_worker_code:1 ,
         St_activity_status: 1,
         St_risk_code: 1,
         St_description_reception_status:"" ,
         St_contact: "",
         St_contact_phone:"" ,
         St_socioeconomic_status: 1,
         St_requester: "",
         St_code_synagogue:1,
         St_code_frequency:1,
        St_amount_frequency:1,
         Parent: new Parentt(1,"","","",""),
         Parent1: new Parentt(1,"","","",""),
         DifficultyStudents:[],
         Worker:undefined,
         StudiesForStudents:[]
/*           
          id: row.ID,
          firstName: row['first name'],
          lastName: row['last name'],
          phone: row.phone,
          city: row.city */
        }));

        resolve(students);
      };

      if (file) {
        fileReader.readAsArrayBuffer(file);
      } else {
        reject("File is undefined");
      }
    });
  }
}
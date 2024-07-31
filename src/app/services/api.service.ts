import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { City } from '../models/city.class';
import { Worker } from '../models/worker.class';
import { Observable } from 'rxjs';
import { AppModule } from "../app.module"
import { map } from 'rxjs/operators';
import { SystemLogin } from '../models/SystemLogin.class';
import { Student } from '../models/student.class';
import { Parentt } from '../models/parent.class';
import { StudiesForStudent } from '../models/studiesForStudent.class';
import { DifficultyStudent } from '../models/difficultyStudent.class';
import { Activity } from '../models/activity.class';
import { StudentForActivity } from '../models/studentForActivity.class';
import { CategoriesForActivity } from '../models/categoriesForActivity.class';
import { Calll } from '../models/call.class';
import { MessageForCall } from '../models/messageForCall.class';
import { RecipientForMessage } from '../models/recipientForMessage.class';
import { Project } from '../models/project.class';
import { StudentForProject } from '../models/studentForProject.class';
import { SubcategoryForTypeActivity } from '../models/subcategoryForTypeActivity.class';
import { Taskk } from '../models/task.class';
import { Community } from '../models/community.class';
import { Synagogue } from '../models/synagogue.class';
import { AddActivityRequest } from '../models/AddActivityRequest.class';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private httpp: HttpClient) { }
  private urlBasis = "https://localhost:44342/api";
  // https://localhost:44342/api/workers/getWorkers/1/0/0/0;
  //private urlBasis = "https://192.168.1.102:44342/api";

  //מחזירה רשימה של ערים
  public getNumber(): Observable<Array<City>> {
    const url: string = this.urlBasis + "/cities/getAllCities";
    return this.httpp.get(url) as Observable<Array<City>>;
  }
  //מוסיפה עיר
  public AddCity(city: City): Observable<any> {
    const url: string = this.urlBasis + "/cities/Add";
    return this.httpp.post<any>(url, city);
  }
  //פעולה המקבלת שם וקוד ומחזירה         //עובד:0  מנהל:1 שגוי:2

  public getLogin(name: string | undefined, password: string | undefined): Observable<Worker> {
    const url: string = this.urlBasis + "/workers/getLogin/" + name + "/" + password;
    return this.httpp.get(url) as Observable<Worker>;
  }
/*   public getLoginWorker(name: string | undefined, password: string | undefined): Observable<Worker> {
    const url: string = this.urlBasis + "/workers/getWorker/" + name + "/" + password;
    return this.httpp.get(url) as Observable<Worker>;
  } */

/*   public getLoginSystem(name: string | undefined, password: string | undefined): Observable<SystemLogin> {
    const url: string = this.urlBasis + "/system/getSystem/" + name + "/" + password;
    return this.httpp.get(url) as Observable<SystemLogin>;
  } */
  //מחזיר רק את הרשומה של תפארת דוד
  public getLoginSystem2(): Observable<SystemLogin> {
    const url: string = this.urlBasis + "/system/getSystem";
    return this.httpp.get(url) as Observable<SystemLogin>;
  }
  //עדכון כניסת מערכת
  public UpdateLoginSystem(systemLogin: SystemLogin): Observable<any> {
    const url: string = this.urlBasis + "/system/Update";
    return this.httpp.put<any>(url, systemLogin);
  }

  //פעולה המקבלת קוד עובד ומחזירה רשימה של תלמידים שלו
  public getStudentForWorker(code: number | undefined): Observable<Array<Student>> {
    const url: string = this.urlBasis + "/students/getStudentsorWorker/" + code;
    return this.httpp.get(url) as Observable<Array<Student>>;
  }

  //מחזירה רשימה של כל העובדים
  public getWorkers(genderO: number, genderF: number, typeWO: number, typeWF: number): Observable<Array<Worker>> {
    const url: string = this.urlBasis + "/workers/getWorkers/" + genderO + "/" + genderF + "/" + typeWO + "/" + typeWF;
    return this.httpp.get(url) as Observable<Array<Worker>>;
  }
  //מחזירה כמות של העובדים
  public getAmountWorkers(value: string, genderO: number, genderF: number, typeWO: number, typeWF: number): Observable<number> {
    const url: string = this.urlBasis + "/workers/GetAmount/" + value + "/" + genderO + "/" + genderF + "/" + typeWO + "/" + typeWF;
    return this.httpp.get(url) as Observable<number>;
  }
  //חיפוש עובד
  public FindWorker(value: string, genderO: number, genderF: number, typeWO: number, typeWF: number): Observable<Array<Worker>> {
    const url: string = this.urlBasis + "/workers/Find/" + value + "/" + genderO + "/" + genderF + "/" + typeWO + "/" + typeWF;
    return this.httpp.get(url) as Observable<Array<Worker>>;
  }
  //מוחקת עובד
  public DeleteWorker(code: number): Observable<number> {
    const url: string = this.urlBasis + "/workers/Delete/" + code;
    return this.httpp.get(url) as Observable<number>;
  }
  //מוסיפה עובד
  public AddWorker(worker: Worker): Observable<any> {
    const url: string = this.urlBasis + "/workers/Add";
    return this.httpp.post<any>(url, worker);
  }
  //עדכון עובד
  public UpdateWorker(worker: Worker): Observable<any> {
    const url: string = this.urlBasis + "/workers/Update";
    return this.httpp.put<any>(url, worker);
  }






  //מחזירה רשימה של כל החניכים
  public getStudents(order: number, genderF: number, statusF: number, workerF: number): Observable<Array<Student>> {
    const url: string = this.urlBasis + "/students/GetStudents/" + order + "/" + genderF + "/" + statusF + "/" + workerF;
    return this.httpp.get(url) as Observable<Array<Student>>;
  }
  //מחזירה כמות של החניכים
  public getAmountStudents(value: string, order: number, genderF: number, statusF: number, workerF: number): Observable<number> {
    const url: string = this.urlBasis + "/students/GetAmount/" + value + "/" + order + "/" + genderF + "/" + statusF + "/" + workerF;
    return this.httpp.get(url) as Observable<number>;
  }
  //חיפוש חניך
  public FindStudent(value: string, order: number, genderF: number, statusF: number, workerF: number): Observable<Array<Student>> {
    const url: string = this.urlBasis + "/students/Find/" + value + "/" + order + "/" + genderF + "/" + statusF + "/" + workerF;
    return this.httpp.get(url) as Observable<Array<Student>>;
  }
  //מוסיפה חניך
  public AddStudent(student: Student): Observable<any> {
    const url: string = this.urlBasis + "/students/Add";
    return this.httpp.post<any>(url, student);
  }
  //מוחקת חניך
  public DeleteStudent(code: number): Observable<number> {
    const url: string = this.urlBasis + "/students/Delete/" + code;
    return this.httpp.get(url) as Observable<number>;
  }
  //עדכון חניך
  public UpdateStudent(student: Student): Observable<any> {
    const url: string = this.urlBasis + "/students/Update";
    return this.httpp.put<any>(url, student);
  }

  //שליחת קובץ אקסל חניכים
  public uploadExcelFile(data: any[]): Observable<any> {
    return this.httpp.post(this.urlBasis + '/Excel/Upload', data);
  }



  //מחזירה רשימה של כל ההורים
  public getParents(): Observable<Array<Parentt>> {
    const url: string = this.urlBasis + "/parents/GetParents";
    return this.httpp.get(url) as Observable<Array<Parentt>>;
  }
  //מוסיפה הורה
  public AddParent(parent: Parentt): Observable<any> {
    const url: string = this.urlBasis + "/parents/Add";
    return this.httpp.post<any>(url, parent);
  }



  //מחזירה רשימה של כל הלימודים לכל החניכים
  public getStudiesForStudens(): Observable<Array<StudiesForStudent>> {
    const url: string = this.urlBasis + "/studiesForStuden/GetStudiesForStudens";
    return this.httpp.get(url) as Observable<Array<StudiesForStudent>>;
  }
  //מוסיפה לימודים
  public AddStudiesForStuden(studies: StudiesForStudent): Observable<any> {
    const url: string = this.urlBasis + "/studiesForStuden/Add";
    return this.httpp.post<any>(url, studies);
  }
  //עדכון לימודים לחניך
  public UpdateStudiesForStuden(studies: StudiesForStudent): Observable<any> {
    const url: string = this.urlBasis + "/studiesForStuden/Update";
    return this.httpp.put<any>(url, studies);
  }




  //רשימה של כל הערים
  public getCities(): Observable<Array<City>> {
    const url: string = this.urlBasis + "/cities/getAllCities";
    return this.httpp.get(url) as Observable<Array<City>>
  }



  //רשימה של כל הקשיים לכל החניכים
  public getDifficultiesStudents(): Observable<Array<DifficultyStudent>> {
    const url: string = this.urlBasis + "/DifficultiesStudents/GetDifficultiesStudents";
    return this.httpp.get(url) as Observable<Array<DifficultyStudent>>
  }
  //מוסיפה רשימה של קשיים לתלמיד
  public AddDifficulitiesForStudent(difficulitiesForStudent: Array<DifficultyStudent>): Observable<any> {
    const url: string = this.urlBasis + "/DifficultiesStudents/AddDifficulitiesForStudent";
    return this.httpp.post<any>(url, difficulitiesForStudent);
  }
  /*     //מעדכנת רשימה של קשיים לתלמיד
      public UpdateDifficulitiesForStudent(difficulitiesForStudent: Array<DifficultyStudent>): Observable<any> {
        const url: string = this.urlBasis + "/DifficultiesStudents/UpdateDifficulitiesForStudent";
        return this.httpp.put<any>(url, difficulitiesForStudent);
      } */
  //מוחקת רשימה של קשיים לתלמיד
  public DeleteDifficulitiesForStudent(code: number): Observable<any> {
    const url: string = this.urlBasis + "/DifficultiesStudents/Delete/" + code;
    return this.httpp.get(url) as Observable<any>;
  }






  //הצגת פעילויות
  public getActivities(order: number, genderF: number, workerF: number, studentF: number, monthF: number, categoryF: number): Observable<Array<Activity>> {
    const url: string = this.urlBasis + "/activities/GetActivities/" + order + "/" + genderF + "/" + workerF + "/" + studentF + "/" + monthF + "/" + categoryF;
    return this.httpp.get(url) as Observable<Array<Activity>>
  }
  //חיפוש פעילות
  public FindActivities(nameWorker: string, order: number, genderF: number, workerF: number, studentF: number, monthF: number, categoryF: number): Observable<Array<Activity>> {
    const url: string = this.urlBasis + "/activities/FindActivities/" + nameWorker + "/" + order + "/" + genderF + "/" + workerF + "/" + studentF + "/" + monthF + "/" + categoryF;
    return this.httpp.get(url) as Observable<Array<Activity>>
  }
  //כמויות פעילות
  public AountsActivities(nameWorker: string, order: number, genderF: number, workerF: number, studentF: number, monthF: number, categoryF: number): Observable<Array<number>> {
    const url: string = this.urlBasis + "/activities/AountsActivities/" + nameWorker + "/" + order + "/" + genderF + "/" + workerF + "/" + studentF + "/" + monthF + "/" + categoryF;
    return this.httpp.get(url) as Observable<Array<number>>
  }
  //הוספת פעילות
/*   public AddActivity(activity: Activity): Observable<any> {
    const url: string = this.urlBasis + "/activities/Add";
    return this.httpp.post<any>(url, activity);
  } */


  addActivity(activity: Activity, files: FileList | undefined): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('activity', JSON.stringify(activity));
    if (files)
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i], files[i].name);
      }
    const url: string = this.urlBasis + "/activities/AddActivity";
    return this.httpp.post(url, formData);
  }
  //הצגת קטגוריות לפעילות
  public getCategories(): Observable<Array<CategoriesForActivity>> {
    const url: string = this.urlBasis + "/activities/GeneralCategories";
    return this.httpp.get(url) as Observable<Array<CategoriesForActivity>>
  }
  //הצגת תת קטגוריות לקטגוריה
  public getSubCategoryForCategory1(codeCategory: number, searchText: string): Observable<Array<SubcategoryForTypeActivity>> {
    const url: string = this.urlBasis + "/activities/SubCategoryForCategory/" + codeCategory + "/" + searchText;
    return this.httpp.get(url) as Observable<Array<SubcategoryForTypeActivity>>
  }
  //הצגת תת קטגוריות לקטגוריה
  public getSubCategoryForCategory(codeCategory: number): Observable<Array<SubcategoryForTypeActivity>> {
    const url: string = this.urlBasis + "/activities/SubCategoryForCategory/" + codeCategory;
    return this.httpp.get(url) as Observable<Array<SubcategoryForTypeActivity>>
  }

  AddSubCategory(subCategory: SubcategoryForTypeActivity): Observable<any> {
    const url: string = this.urlBasis + "/activities/AddSubCategory";
    return this.httpp.post<any>(url, subCategory);}


  //מקבלת קוד חניך ושולפת מתי היתה הפעילות האחרונה איתו
  public getLastActivityForStudent(studentCode: number | undefined): Observable<string> {
    const url: string = this.urlBasis + "/activities/GetLastActivityForStudent/" + studentCode;
    return this.httpp.get(url) as Observable<string>
  }


  //שליחת תמונת חניך לשרת
  uploadImageStudent(formData: FormData, name: string): Observable<any> {

    const url: string = this.urlBasis + "/images/UploadStudentImage/" + name;
    return this.httpp.post(url, formData);
  }
  //קבלת תמונת חניך מהשרת
  public getImageStudent(imageName: string): Observable<any> {
    const url: string = this.urlBasis + "/images/GetImage/" + imageName;
    return this.httpp.get(url, { responseType: 'blob' }) as Observable<any>
  }
  //הצגת שיחות
  public getCalls(codeWorker: number, mailEnterOrSend: number): Observable<Array<Calll>> {
    const url: string = this.urlBasis + "/calls/GetCallls/" + codeWorker + "/" + mailEnterOrSend;
    return this.httpp.get(url) as Observable<Array<Calll>>
  }
  //הצגת הודעות לשיחה
  public getMessagesForCalls(codeCall: number): Observable<Array<MessageForCall>> {
    const url: string = this.urlBasis + "/calls/GetMessageForCallsForCodeCall/" + codeCall;
    return this.httpp.get(url) as Observable<Array<MessageForCall>>
  }
  //הצגת נמענים להודעה 
  public getRecipientsForMessage(codeMessage: number): Observable<Array<RecipientForMessage>> {
    const url: string = this.urlBasis + "/calls/GetRecipientsForMessage/" + codeMessage;
    return this.httpp.get(url) as Observable<Array<RecipientForMessage>>
  }
  //הוספת שיחה
  public AddCall(call: Calll): Observable<any> {
    const url: string = this.urlBasis + "/calls/AddCall";
    return this.httpp.post<any>(url, call);
  }
  //הוספת הודעה
  public AddMessage(message: MessageForCall): Observable<any> {
    const url: string = this.urlBasis + "/calls/AddMessage";
    return this.httpp.post<any>(url, message);
  }
  //הוספת רשימת נמענים
  public AddRecipientsForMessage(RecipientsForMessage: Array<RecipientForMessage>): Observable<any> {
    const url: string = this.urlBasis + "/calls/AddRecipientsForMessage";
    return this.httpp.post<any>(url, RecipientsForMessage);
  }
  //עדכון הודעה ל-נקראה /לא נקראה
  public UpdateMessageDone(message: MessageForCall): Observable<any> {
    const url: string = this.urlBasis + "/calls/UpdateMessageDone";
    return this.httpp.put<any>(url, message);
  }
  //הצגת כמות ההודעות שלא נקראו
  public GetAmoumtMessagesNotDoneForWorker(workerCode: number): Observable<number> {
    const url: string = this.urlBasis + "/calls/GetAmoumtMessagesNotDoneForWorker/" + workerCode;
    return this.httpp.get(url) as Observable<number>
  }
  //הצגת פרויקטים
  public getProgects(genderF: number | undefined): Observable<Array<Project>> {
    const url: string = this.urlBasis + "/projects/GetProgects/" + genderF;
    return this.httpp.get(url) as Observable<Array<Project>>
  }
  //הצגת חניכים לפרויקט    
  public getStudentsForProjects(codeProject: number): Observable<Array<StudentForProject>> {
    const url: string = this.urlBasis + "/projects/GetStudentsForProjects/" + codeProject;
    return this.httpp.get(url) as Observable<Array<StudentForProject>>
  }
  //הוספת פרויקט
  //הוספת חניכים לפרויקט
  //הוספת חניך לפקרויקט
  //הוספת חניכים לפרויקט לפי קוד פעיל
  public AddStudentsForProjectForWorker(codeWorker: number | undefined, codeProject: number): Observable<any> {
    const url: string = this.urlBasis + "/projects/AddStudentsForProjectForWorker/" + codeWorker + "/" + codeProject;
    return this.httpp.get<any>(url);
  }

  //הצגת כל המשימות לפי קוד פעיל
  public GetAllTastForWorker(workerCode: number): Observable<Array<Taskk>> {
    const url: string = this.urlBasis + "/tasks/GetAllTastForWorker/" + workerCode;
    return this.httpp.get(url) as Observable<Array<Taskk>>
  }
  //הצגת כמות המשימות שלא התבצעו
  public GetAmoumtTasksNotDoneForWorker(workerCode: number): Observable<number> {
    const url: string = this.urlBasis + "/tasks/GetAmoumtTasksNotDoneForWorker/" + workerCode;
    return this.httpp.get(url) as Observable<number>
  }
  //עדכון משימה
  public UpdateTask(task: Taskk): Observable<any> {
    const url: string = this.urlBasis + "/tasks/Update";
    return this.httpp.put<any>(url, task);
  }
  //הוספת משימה
  public AddTask(task: Taskk): Observable<any> {
    const url: string = this.urlBasis + "/tasks/AddTask";
    return this.httpp.post<any>(url, task);
  }
//מחיקת משימה
public deleteTask(task:Taskk):Observable<any>{
  const url: string = this.urlBasis + "/tasks/DeleteTask";
  return this.httpp.post<any>(url, task);
}


  //הצגת כל הקהילות

  public GetAllCommunities(): Observable<Array<Community>> {
    const url: string = this.urlBasis + "/Communities/GetAllCommunities";
    return this.httpp.get(url) as Observable<Array<Community>>
  }
  //הצגת כל הבתי כנסיות 
  public GetAllSynagogues(): Observable<Array<Synagogue>> {
    const url: string = this.urlBasis + "/Communities/GetAllSynagogues";
    return this.httpp.get(url) as Observable<Array<Synagogue>>
  }
  //הצגת כל הבתי כנסיות ששיכים לקהילה מסוימת
  public etAllSynagoguesOfCommunity(codeCommunity: number): Observable<Array<Synagogue>> {
    const url: string = this.urlBasis + "/Communities/etAllSynagoguesOfCommunity/" + codeCommunity;
    return this.httpp.get(url) as Observable<Array<Synagogue>>
  }
  //הוספת קהילה
  public AddCommunity(community: Community): Observable<any> {
    const url: string = this.urlBasis + "/Communities/AddCommunity";
    return this.httpp.post<any>(url, community);
  }

  //הוספת בית כנסת
  public AddSynagogue(synagogue: Synagogue): Observable<any> {
    const url: string = this.urlBasis + "/Communities/AddSynagogue";
    return this.httpp.post<any>(url, synagogue);
  }
  //העלאת קבצים לפעילויות לחניכים ולעובדים
  public FilesUpload(folder: string, newFolder: number, formData: FormData): Observable<any> {
    const url: string = this.urlBasis + "/Files/Upload/" + folder + "/" + newFolder;
    return this.httpp.post<any>(url, formData);
  }

}







import { HttpClient, HttpParams } from '@angular/common/http';

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
import { SharerForProject } from '../models/sharerForProject.class';
import { GuideForProject } from '../models/guideForProject.class';
import { GuideWithRelations } from '../models/guideWithRelations.interface';
import { StudiesForSharer } from '../models/studiesForSharer.class';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  constructor(private httpp: HttpClient) { }
  public urlBasisSocket = 'http://localhost:3000';

  private urlBasis = 'http://localhost:3000/api';
/* 
      public urlBasisSocket = 'https://myserver-production-c24f.up.railway.app';
  
    private urlBasis = 'https://myserver-production-c24f.up.railway.app/api'; */

  //כניסה
  getLogin(name: string, password: string): Observable<any> {
    const body = { name, password };
    return this.httpp.post(`${this.urlBasis}/workers/login`, body);
  }


  //רשימה של כל הערים
  getCities(): Observable<City[]> {
    return this.httpp.get<City[]>(this.urlBasis + "/cities");
  }
  //מוסיפה עיר
  AddCity(city: City): Observable<City> {
    return this.httpp.post<City>(this.urlBasis + "/cities", city);
  }


  //מחזיר רק את הרשומה של תפארת דוד
  getSystemLogin(): Observable<SystemLogin> {
    return this.httpp.get<SystemLogin>(this.urlBasis + "/systemLogins");
  }
  //עדכון כניסת מערכת
  UpdateSystemLogin(systemLogin: SystemLogin): Observable<any> {
    const body = { systemLogin };
    return this.httpp.put(`${this.urlBasis} /systemLogins/${systemLogin.SL_code}`, body);
  }
  //+מחזירה רשימה של כל העובדים
  //חיפוש עובד
  public FindWorker(value: string, genderO: number, genderF: number, statusF: number, typeWO: number, typeWF: number): Observable<Array<Worker>> {
    const params = new HttpParams()
      .set('value', value.toString())
      .set('genderO', genderO.toString())
      .set('genderF', genderF.toString())
      .set('statusF', statusF.toString())
      .set('typeWO', typeWO.toString())
      .set('typeWF', typeWF.toString());
    return this.httpp.get<Array<Worker>>(this.urlBasis + "/workers", { params });

  }



  //+מחזירה רשימה של כל החניכים
  //חיפוש חניך
  public FindStudent(value: string, order: number, genderF: number, statusF: number, workerF: number): Observable<Array<Student>> {
    const params = new HttpParams()
      .set('value', value.toString())
      .set('order', order.toString())
      .set('genderF', genderF.toString())
      .set('statusF', statusF.toString())
      .set('workerF', workerF.toString());
    return this.httpp.get<Array<Student>>(this.urlBasis + "/students", { params });

  }
  //הצגת כל הקהילות
  public GetAllCommunities(): Observable<Array<Community>> {
    return this.httpp.get<Array<Community>>(this.urlBasis + "/communities");
  }
  //הצגת כל הבתי כנסיות 
  public GetAllSynagogues(): Observable<Array<Synagogue>> {
    return this.httpp.get<Array<Synagogue>>(this.urlBasis + "/synagogues");
  }
  //הצגת כל הבתי כנסיות ששיכים לקהילה מסוימת
  public GetAllSynagoguesOfCommunity(codeCommunity: number): Observable<Array<Synagogue>> {
    const params = new HttpParams()
      .set('codeCommunity', codeCommunity.toString())
    return this.httpp.get<Array<Synagogue>>(this.urlBasis + "/synagogues/ofCommunity", { params });
  }
  //הצגת הורה לפי קוד הורה
  public GetParentOfCode(codeParent: number): Observable<Parentt> {
    const params = new HttpParams()
      .set('codeParent', codeParent.toString())
    return this.httpp.get<Parentt>(this.urlBasis + "/parents/OfCode", { params });
  }
  //הצגת לימודים לחניך לפי קוד חניך
  public GetStudiesOfCodeStudent(codeStudent: number): Observable<StudiesForStudent> {
    const params = new HttpParams()
      .set('codeStudent', codeStudent.toString())
    return this.httpp.get<StudiesForStudent>(this.urlBasis + "/studiesForStudents/OfCodeStudent", { params });
  }
  //הצגת לימודים למשתתף לפי קוד משתתף
  public GetStudiesOfCodeSharer(codeSharer: number): Observable<StudiesForSharer> {
    const params = new HttpParams()
      .set('codeSharer', codeSharer.toString())
    return this.httpp.get<StudiesForSharer>(this.urlBasis + "/studiesForShareres/OfCodeSharer", { params });
  }
  //הצגת עובד לחניך לפי קוד עובד
  public GetWorkerOfCodeStudent(codeWoreker: number): Observable<Worker> {
    const params = new HttpParams()
      .set('codeWoreker', codeWoreker.toString())
    return this.httpp.get<Worker>(this.urlBasis + "/workers/OfCodeWorker", { params });
  }
  //הצגת רשימת קשיים לחניך לפי קוד חניך
  public GetDifficultyesOfCodeStudent(codeStudent: number): Observable<Array<DifficultyStudent>> {
    const params = new HttpParams()
      .set('codeStudent', codeStudent.toString())
    return this.httpp.get<Array<DifficultyStudent>>(this.urlBasis + "/difficultyStudents/OfCodeStudent", { params });
  }
  //הצגת פעילויות + חיפוש
  public FindActivities(nameWorker: string, nameStudent: string, order: number, genderF: number, workerF: number, workerStatusF: number, studentF: number, monthF: number, yearF: number, categoryF: number): Observable<Array<Activity>> {
    const params = new HttpParams()
      .set('nameWorker', nameWorker.toString())
      .set('nameStudent', nameStudent.toString())
      .set('order', order.toString())
      .set('genderF', genderF.toString())
      .set('workerF', workerF.toString())
      .set('workerStatusF', workerStatusF.toString())
      .set('studentF', studentF.toString())
      .set('monthF', monthF.toString())
      .set('yearF', yearF.toString())
      .set('categoryF', categoryF.toString());

    return this.httpp.get<Array<Activity>>(this.urlBasis + "/activities", { params });

  }
  //הצגת קטגוריות לפעילות
  public getCategories(): Observable<Array<CategoriesForActivity>> {
    return this.httpp.get<Array<CategoriesForActivity>>(this.urlBasis + "/categoriesForActivities");
  }
  //הצגת פרויקטים
  public getProgects(genderF: number, valueSearch: string): Observable<Array<Project>> {
    const params = new HttpParams()
      .set('genderF', genderF.toString())
      .set('valueSearch', valueSearch.toString());

    return this.httpp.get<Array<Project>>(this.urlBasis + "/projects", { params });
  }


  //הצגת כל המשימות לפי קוד פעיל
  public GetAllTastForWorker(workerCode: number, amountDisplay: number): Observable<Array<Taskk>> {
    const params = new HttpParams()
      .set('workerCode', workerCode.toString())
      .set('amountDisplay', amountDisplay.toString());
    return this.httpp.get<Array<Taskk>>(this.urlBasis + "/tasks", { params });
  }
  //הצגת כמות המשימות שלא התבצעו
  //0 - לא בוצע    
  //1- כן בוצע
  public GetAmoumtTasksNotDoneForWorker(workerCode: number): Observable<number> {
    const params = new HttpParams()
      .set('workerCode', workerCode.toString());
    return this.httpp.get<number>(this.urlBasis + "/tasks/GetAmoumtTasksNotDoneForWorker", { params });

  }
  //מוסיפה עובד
  AddWorker(workerData: Worker) {
    return this.httpp.post(this.urlBasis + "/workers", workerData);
  }

  //עדכון עובד
  UpdateWorker(workerData: Worker): Observable<any> {
    const wo_code = workerData.Wo_code;
    return this.httpp.put(`${this.urlBasis + "/workers"}/${wo_code}`, workerData);
  }
  //הוספת משימה
  AddTask(task: Taskk) {
    return this.httpp.post(this.urlBasis + "/tasks", task);
  }
  //עדכון משימה
  UpdateTask(task: Taskk): Observable<any> {
    const Ta_code = task.Ta_code;
    return this.httpp.put(`${this.urlBasis + "/tasks"}/${Ta_code}`, task);
  }
  //מחיקת משימה
  deleteTask(Ta_code: number) {
    return this.httpp.delete(`${this.urlBasis}/tasks/${Ta_code}`);
  }
  //הוספת חניך
  AddStudent(studentData: any): Observable<any> {
    return this.httpp.post(this.urlBasis + "/students", studentData);
  }

  //הוספת קהילה
  AddCommunity(community: Community): Observable<any> {
    return this.httpp.post(this.urlBasis + "/communities", community);
  }

  //הוספת בית כנסת
  AddSynagogue(synagogue: Synagogue): Observable<any> {
    return this.httpp.post(this.urlBasis + "/synagogues", synagogue);
  }
  //הוספת ועדכון תמונה לחניך
  uploadStudentImage(formData: FormData): Observable<any> {
    return this.httpp.post(`${this.urlBasis + "/students/upload-student-image"}`, formData);
  }
  //עדכון חניך
  UpdateStudent(studentData: any): Observable<any> {
    return this.httpp.put(this.urlBasis + "/students", studentData);
  }
  //עדכון משתתף
  UpdateSharer(sharerData: any): Observable<any> {
    return this.httpp.put(this.urlBasis + "/shareres", sharerData);
  }
  //עדכון משתתף לפרויקט
  UpdateSharerForProject(sharerForProject: SharerForProject): Observable<any> {
    const SFP_code = sharerForProject.SFP_code;
    return this.httpp.put(`${this.urlBasis + "/sharerForProjects"}/${SFP_code}`, sharerForProject);
  }
  //עדכון חניך לפרויקט
  UpdateStudentForProject(studentForProject: StudentForProject): Observable<any> {
    const SFP_code = studentForProject.SFP_code;
    return this.httpp.put(`${this.urlBasis + "/studentForProjects"}/${SFP_code}`, studentForProject);
  }
  //עדכון מדריך לפרויקט
  UpdateGuideForProject(guideForProject: GuideForProject): Observable<any> {
    const id = guideForProject.GFP_code;
    return this.httpp.put(`${this.urlBasis + "/guideForProjects"}/${id}`, guideForProject);
  }
  //קבלת תמונת חניך מהשרת
  getStudentImage(imageName: string) {
    const url = `${this.urlBasis}/students/getStudentImage/${imageName}`;
    return this.httpp.get(url, { responseType: 'blob' }); // החזרת Blob כדי להציג תמונה
  }
  //מוחקת חניך
  DeleteStudent(code: number) {
    return this.httpp.delete(`${this.urlBasis}/students/${code}`);
  }
  //הצגת תת קטגוריות לקטגוריה לפי קוד קטגוריה
  getSubCategoryForCategory(codeCategory: number): Observable<Array<SubcategoryForTypeActivity>> {
    const params = new HttpParams()
      .set('codeCategory', codeCategory.toString())
    return this.httpp.get<Array<SubcategoryForTypeActivity>>(this.urlBasis + "/subcategoryForTypeActivities/ofCodeCategory", { params });
  }
  //הוספת תת קטגוריה
  AddSubCategory(subCategory: SubcategoryForTypeActivity): Observable<any> {
    return this.httpp.post(this.urlBasis + "/subcategoryForTypeActivities", subCategory);

  }
  //מקבלת קוד חניך ושולפת מתי היתה הפעילות האחרונה איתו
  public getLastActivityForStudent(studentCode: number): Observable<any> {
    return this.httpp.get(`${this.urlBasis}/activities/lastActivityForStudent/${studentCode}`);
  }
  //הוספת פעילות לא כולל קבצים
  addActivity(activity: Activity): Observable<any> {
    return this.httpp.post(`${this.urlBasis}/activities/`, activity);
  }
  //שליחת קובץ אקסל חניכים
  uploadExcelFileStudents(formData: FormData) {
    return this.httpp.post(this.urlBasis + '/students/importExcel', formData);
  }
  //שליחת קובץ אקסל משתתפים לפרויקט
  uploadExcelFileSharersForProject(formData: FormData, codeProject: number) {
    return this.httpp.post(`${this.urlBasis + "/sharerForProjects/importExcel"}/${codeProject}`, formData);
  }
  //הוספת פרויקט
  AddProject(project: Project): Observable<any> {
    return this.httpp.post(`${this.urlBasis}/projects/`, project);
  }
  //עדכון פרויקט
  UpdateProject(project: Project): Observable<any> {
    const Pr_code = project.Pr_code;
    return this.httpp.put(`${this.urlBasis + "/projects"}/${Pr_code}`, project);
  }
  //מחיקת פרויקט
  deleteProject(Pr_code: number): Observable<any> {
    return this.httpp.delete(`${this.urlBasis + "/projects"}/${Pr_code}`);
  }


  /*   //הצגת חניכים לפרויקט    
    public getStudentsForProjects(codeProject: number): Observable<Array<StudentForProject>> {
      const params = new HttpParams()
        .set('codeProject', codeProject.toString());
      return this.httpp.get<Array<StudentForProject>>(this.urlBasis + "/studentForProjects", { params });
    }
    //הצגת משתתפים לפרויקט    
    public getSharersForProjects(codeProject: number): Observable<Array<SharerForProject>> {
      const params = new HttpParams()
        .set('codeProject', codeProject.toString());
      return this.httpp.get<Array<SharerForProject>>(this.urlBasis + "/sharerForProjects", { params });
    } */
  //הצגת פרויקטים לחניך    
  public getProjectsForStudent(codeStudent: number): Observable<Array<StudentForProject>> {
    const params = new HttpParams()
      .set('codeStudent', codeStudent.toString());
    return this.httpp.get<Array<StudentForProject>>(this.urlBasis + "/studentForProjects/forStudent", { params });
  }
  //הצגת פרויקטים למשתתף    
  public getProjectsForSharer(codeSharer: number): Observable<Array<SharerForProject>> {
    const params = new HttpParams()
      .set('codeSharer', codeSharer.toString());
    return this.httpp.get<Array<SharerForProject>>(this.urlBasis + "/sharerForProjects/forSharer", { params });
  }
  //הצגת מדריכים לפרויקט    
  public getGuidesForProjects(codeProject: number): Observable<Array<GuideForProject>> {
    const params = new HttpParams()
      .set('codeProject', codeProject.toString());
    return this.httpp.get<Array<GuideForProject>>(this.urlBasis + "/guideForProjects", { params });
  }
  //הצגת מדריכים לפרויקט כולל חניכים ומשתתפים    
  public getGuidesForProjectsWithSudentsAndSharers(codeProject: number): Observable<Array<GuideWithRelations>> {
    const params = new HttpParams()
      .set('codeProject', codeProject.toString());
    return this.httpp.get<Array<GuideWithRelations>>(this.urlBasis + "/guideForProjects/WithSudentsAndSharers", { params });
  }
  //הוספת חניך לפרויקט
  AddStudentForProject(studentForProject: StudentForProject): Observable<any> {
    return this.httpp.post<any>(this.urlBasis + "/studentForProjects", studentForProject);
  }
  //הוספת חניכים לפרויקט לפי קוד פעיל
  public AddStudentsForProjectForWorker(codeWorker: number, codeProject: number): Observable<any> {
    return this.httpp.post(`${this.urlBasis + "/studentForProjects"}/${codeWorker}/${codeProject}`, null);
  }
  //הוספת משתתף לפרויקט
  AddSharerForProject(sharerForProject: SharerForProject): Observable<any> {
    return this.httpp.post<any>(this.urlBasis + "/sharerForProjects", sharerForProject);
  }
  //הוספת מדריך לפרויקט
  AddGuideForProject(guideForProject: GuideForProject): Observable<any> {
    return this.httpp.post<any>(this.urlBasis + "/guideForProjects", guideForProject);
  }
  //מוחקת חניך מפרויקט
  deleteStudentForProject(SFP_code: number) {
    return this.httpp.delete(`${this.urlBasis + "/studentForProjects"}/${SFP_code}`);
  }
  //מוחקת משתתף מפרויקט
  deleteSharerForProjects(SFP_code: number) {
    return this.httpp.delete(`${this.urlBasis + "/sharerForProjects"}/${SFP_code}`);
  }
  //מוחקת מדריך מפרויקט
  deleteGuideForProjects(code: number) {
    return this.httpp.delete(`${this.urlBasis + "/guideForProjects"}/${code}`);
  }
  //מחיקת כל הפעילויות
  DeleteActi() {
    const code = 9;
    return this.httpp.delete(`${this.urlBasis}/activities/${code}`);
  }
  //מוחקת עובד
  DeleteWorker(wo_code: number) {
    return this.httpp.delete(`${this.urlBasis + "/workers"}/${wo_code}`);
  }
  //עדכון חניך עבור שיוך חניך לפרויקט בלבד
  UpdateStudentForStudentForProjectOnly(student: Student): Observable<any> {
    const St_code = student.St_code;
    return this.httpp.put(`${this.urlBasis + "/students"}/${St_code}`, student);
  }
  //הצגת נתונים לדשבורד
  DisplayDashboard(codeFilter: number): Observable<Array<Array<number>>> {
    const params = new HttpParams()
      .set('codeFilter', codeFilter.toString());
    return this.httpp.get<Array<Array<number>>>(this.urlBasis + "/dashboard/matrix", { params });
  }


  //////////////////////////////////////עד כאן שינתי































  //הצגת שיחות
  public getCalls(codeWorker: number, mailEnterOrSend: number): Observable<Array<Calll>> {
    const url: string = this.urlBasis + "/calls/GetCallls/" + codeWorker + "/" + mailEnterOrSend;
    return this.httpp.get(url) as Observable<Array<Calll>>
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
  public UpdateRecipientDone(recipient: RecipientForMessage | undefined): Observable<any> {
    const url: string = this.urlBasis + "/calls/UpdateRecipientDone";
    return this.httpp.put<any>(url, recipient);
  }
  /*
//הצגת כמות ההודעות שלא נקראו
public GetAmoumtMessagesNotDoneForWorker(workerCode: number): Observable<number> {
  const url: string = this.urlBasis + "/calls/GetAmoumtMessagesNotDoneForWorker/" + workerCode;
  return this.httpp.get(url) as Observable<number>
}
*/













  //העלאת קבצים לפעילויות לחניכים ולעובדים
  public FilesUpload(folder: string, newFolder: number, formData: FormData): Observable<any> {
    const url: string = this.urlBasis + "/Files/Upload/" + folder + "/" + newFolder;
    return this.httpp.post<any>(url, formData);
  }


  /*  
    //הוספת פעילות כולל קבצים

   addActivity(activity: Activity, files: FileList | undefined): Observable<any> {
      const formData: FormData = new FormData();
  
      formData.append('activity', JSON.stringify(activity));
      if (files)
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i], files[i].name);
        }
      const url: string = this.urlBasis + "/activities/AddActivity";
      return this.httpp.post(url, formData);
    } */
}
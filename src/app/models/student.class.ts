import { DifficultyStudent } from "./difficultyStudent.class";
import { Parentt } from "./parent.class";
import { StudiesForStudent } from "./studiesForStudent.class";

export class Student {
    constructor(public St_code: number,
        public St_ID: string,
        public St_gender: number,
        public St_name: string,
        public St_Fname: string,
        public St_image: string,
        public St_birthday: string,
        public St_father_code: number | undefined,
        public St_mother_code: number | undefined,
        public St_city_code: number | undefined,
        public St_address: string,
        public St_cell_phone: string,
        public St_phone: string,
        public St_email: string,
        public St_worker_code: number,
        public St_activity_status: number,
        public St_risk_code: number | undefined,
        public St_description_reception_status: string,
        public St_contact: string,
        public St_contact_phone: string,
        public St_socioeconomic_status: number |undefined,
        public St_requester: string,
        public St_code_synagogue: number | undefined,
        public St_code_frequency: number | undefined,
        public St_amount_frequency: number |undefined,
        public St_nusah_tfila: string,
        public St_hebrew_date: string,
        public St_reception_date: string,

    ) { }


}
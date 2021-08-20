import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue, updateRecord } from 'lightning/uiRecordApi';

import ID_FIELD from '@salesforce/schema/Account.Id';
import RICH_FIELD from '@salesforce/schema/Account.RichText__c';
import TYPE_FIELD from '@salesforce/schema/Account.Type';

const fields = [RICH_FIELD, TYPE_FIELD];



export default class AccountRich extends LightningElement {
    @api recordId;
    @api objectApiName; 

    //this wire can be skipped if you arent using get name and get type anywhere which is commented
    @wire(getRecord, { recordId : '$recordId', fields })
    account;
    //these properties will carry  the value entered in HTML and later be used to send to SF
    richfield;
    type;
    nameCount;
   
   
    handleChange(event){
        console.log('Change event logged');
        if(event.target.name === "richfield"){
            this.richfield = event.target.value;
            this.nameCount = this.richfield.length;
        }else if(event.target.name === "type"){
            this.type = event.target.value;
        }
        //this.accName = event.target.value;
        //console.log('New Name '+this.accName);
        console.log('New rich field from getter '+this.richfield);
        console.log('New Type from getter '+this.type);


    }
    
    // as you click on updateAccount you can use first check the length of Name, then throw
    //error if the count is greater than 10 otherwise update
    handleSubmit(event){
        console.log('Event submitted');
        
        event.preventDefault();

        //const inputCmp = this.template.querySelector(".nameInput");
        const inputCmp = this.template.querySelector("lightning-input");

        //const inputCmp = this.template.querySelector("lightning-input-rich-text");
        console.log('inputCmp '+inputCmp);

        //const value = inputCmp.value;
        const value = this.nameCount;
        console.log('Count No. '+value);

        //if(!value.includes("ABC")){
        if(value > 10){   
            console.log('Count No. over 10 '+value);

            inputCmp.setCustomValidity("Count should be below 10");


        }else{
            console.log('Count No. below 10 '+value);

            inputCmp.setCustomValidity(""); 
            console.log('Count No. below 10 '+value);

            //const fields = event.detail.fields;
            //fields.Name = this.accName;
            const fields = {};
            //there are many ways to send the values into this fields array
            // we will use this to send this array into updateRecord which can update in org
            //without any Apex
            fields[ID_FIELD.fieldApiName] = this.recordId;
            fields[RICH_FIELD.fieldApiName] = this.richfield;
            fields[TYPE_FIELD.fieldApiName] = this.type;
           // console.log('field : '+fields[TYPE_FIELD.fieldApiName]);
            //console.log('type : '+this.type.value);

            const recordInput = {
                fields: fields
            };

            updateRecord(recordInput).then((record) => {
                console.log(record);
            });

        }
        inputCmp.reportValidity(); 

    }

}

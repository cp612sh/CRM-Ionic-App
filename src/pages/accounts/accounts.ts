import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Searchbar } from 'ionic-angular';
import { LeadsService } from './../../providers/leads-service';
import { ContactsService } from './../../providers/contacts-service';
import { mobiscroll } from './accounts.module.ts';
import _ from 'lodash';

@IonicPage()
@Component({
    selector: 'page-accounts',
    templateUrl: 'accounts.html',
})

export class Accounts {
    @ViewChild('searchbar') searchbar: Searchbar;
    accounts: any = [];
    groupedList: any = [];
    searchText: string = '';
    searchCondition: number = 0;
    showSearchBar: boolean = false;

    searchSettings: any = {
        placeholder: 'Required',
        minWidth: 200
    };

    formSettings: any = {
        
    };
    
    sub: any;

    constructor(private navCtrl: NavController, private leadsService: LeadsService, private contactsService: ContactsService) {
    }

    ionViewDidLoad() {

        this.sub = this.contactsService.allCompaniesAndContacts$.subscribe(res => {
            this.accounts = _.filter(res, { type: "Account" });
            this.accounts = _.sortBy(this.accounts, 'companyName');
            this.accounts = _.orderBy(this.accounts, [lead => lead['companyName'].toUpperCase()], ['asc']);

            this.search(this.searchText, this.searchCondition);
            //this.groupList(this.accounts);
        });
    }

    ionViewWillUnload() {
        this.sub.unsubscribe();
    }

    doRefresh(event) {
        setTimeout(() => {
            this.contactsService.setAllCompaniesAndContacts();
            event.complete();    
        }, 2000);
    }

    conditionChanged(event) {
        this.searchCondition = event.target.value;
        this.search(this.searchText, this.searchCondition);
    }

    itemTapped(event, item) {
        this.navCtrl.push('Company', {
            item: item
        });
    }

    toggleSearchBar() {
        this.showSearchBar = !this.showSearchBar;
        this.navCtrl.resize();
        if (this.showSearchBar) {
          setTimeout(() => {
            this.searchbar.setFocus();
          });
        }
    }

    search(text, condition) {
         // initialize the data
         this.groupedList = [];
         
        // set val to the value of the ev target
        
        let filteredList: any = [];
        
        // if the value is an empty string don't filter the items
        if (text && text.trim() != '') {
            filteredList = this.accounts.filter((item) => {
                return (item.companyName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
        }
        else
            filteredList = this.accounts;

        if (condition == 1) {
            filteredList = filteredList.filter((item) => {
                return (item.isFavorite = true);
            });
        }
        else if (condition == 2) {
            filteredList = filteredList.filter((item) => {
                return (item.isOverdue = true);
            });
        }
        else if (condition == 3) {
            filteredList = filteredList.filter((item) => {
                return (item.nextActivityDate != null);
            });
        }
        else if (condition == 4) {
            filteredList = filteredList.filter((item) => {
                return (item.nextActivityDate == null);
            });
        }
        else if (condition == 5) {
            filteredList = filteredList.filter((item) => {
                return (item.status == 'Key');
            });
        }
        else if (condition == 6) {
            filteredList = filteredList.filter((item) => {
                return (item.status == 'Development');
            });
        }
        this.groupList(filteredList);
    }

    searchThis($event) {
        this.search(this.searchText, this.searchCondition);
    }

    clearSearch($event) {
        this.searchText = '';
        
        // reset the view with all data
        this.groupedList = [];
        this.groupList(this.accounts);
    }

    cancelSearch($event) {
        this.searchText = '';
        this.showSearchBar = !this.showSearchBar;

        // reset the view with all data
        this.groupedList = [];
        this.groupList(this.accounts);
    }

    groupList(accounts) {

        let sortedAccounts = accounts;
        let currentLetter = false;
        let currentAccounts = [];
 
        sortedAccounts.forEach((value, index) => {

            if(value.companyName.charAt(0) != currentLetter){
 
                currentLetter = value.companyName.charAt(0);
 
                let newGroup = {
                    letter: currentLetter,
                    accounts: []
                };
 
                currentAccounts = newGroup.accounts;
                this.groupedList.push(newGroup);
            } 
 
            currentAccounts.push(value);
        });
    }
}

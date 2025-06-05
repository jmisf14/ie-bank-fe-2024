<template>
  <div class="jumbotron vertical-center">
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <h1>Accounts</h1>
          <hr />
          <br />
          <!-- Alert Message -->
          <b-alert v-if="showMessage" variant="success" show>{{
            message
          }}</b-alert>
          <!-- b-alert v-if="error" variant="danger" show>{{ error }}</b-alert-->

          <div class="d-flex justify-content-between align-items-center mb-3">
             <button
              type="button"
              class="btn btn-success btn-sm"
              v-b-modal.account-modal
            >
              Create Account
            </button>
             <b-form-input
               v-model="searchQuery"
               placeholder="Search accounts..." size="sm" class="w-25"
             ></b-form-input>
          </div>

          <table class="table table-hover">
            <thead>
              <tr>
                <th scope="col">Account Name</th>
                <th scope="col">Account Number</th>
                <th scope="col">Account Balance</th>
                <th scope="col">Account Currency</th>
                <th scope="col">Account Country</th>
                <th scope="col">Account Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="account in filteredAccounts" :key="account.id">
                <td>
                  <router-link :to="{ name: 'AccountDetails', params: { id: account.id }}">
                    {{ account.name }}
                  </router-link>
                </td>
                <td>{{ account.account_number }}</td>
                <td>{{ account.balance }}</td>
                <td>{{ account.currency }}</td>
                <td>{{ account.country }}</td>
                <td>
                  <span
                    v-if="account.status == 'Active'"
                    class="badge badge-success"
                    >{{ account.status }}</span
                  >
                  <span v-else class="badge badge-danger">{{
                    account.status
                  }}</span>
                </td>
                <td>
                  <div class="btn-group" role="group">
                    <button
                      type="button"
                      class="btn btn-info btn-sm"
                      v-b-modal.edit-account-modal
                      @click="editAccount(account)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger btn-sm"
                      @click="deleteAccount(account)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredAccounts.length === 0">
                 <td colspan="7" class="text-center">No accounts found.</td>
              </tr>
            </tbody>
          </table>
          <footer class="text-center">
            Copyright &copy; All Rights Reserved.
          </footer>
        </div>
      </div>
      <b-modal
        ref="addAccountModal"
        id="account-modal"
        title="Create a new account"
        hide-backdrop
        hide-footer
      >
        <b-form @submit="onSubmit" class="w-100">
          <b-form-group
            id="form-name-group"
            label="Account Name:"
            label-for="form-name-input"
          >
            <b-form-input
              id="form-name-input"
              type="text"
              v-model="createAccountForm.name"
              placeholder="Account Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="form-currency-group"
            label="Currency:"
            label-for="form-currency-input"
          >
            <b-form-input
              id="form-currency-input"
              type="text"
              v-model="createAccountForm.currency"
              placeholder="$ or €"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="form-country-group"
            label="Country:"
            label-for="form-country-input"
            :state="validationState(createAccountForm.country)"
          >
            <b-form-input
              id="form-country-input"
              type="text"
              v-model="createAccountForm.country"
              placeholder="e.g. ES or US"
              :state="validationState(createAccountForm.country)"
              required
            >
            </b-form-input>
             <b-form-invalid-feedback :state="validationState(createAccountForm.country)">
                Country code must be 2 letters.
             </b-form-invalid-feedback>
          </b-form-group>

          <b-button type="submit" variant="outline-info" :disabled="!isCreateFormValid">Submit</b-button>
        </b-form>
      </b-modal>
      <!-- End of Modal for Create Account-->
      <!-- Start of Modal for Edit Account-->
      <b-modal
        ref="editAccountModal"
        id="edit-account-modal"
        title="Edit the account"
        hide-backdrop
        hide-footer
      >
        <b-form @submit="onSubmitUpdate" class="w-100">
          <b-form-group
            id="form-edit-name-group"
            label="Account Name:"
            label-for="form-edit-name-input"
          >
            <b-form-input
              id="form-edit-name-input"
              type="text"
              v-model="editAccountForm.name"
              placeholder="Account Name"
              required
            >
            </b-form-input>
          </b-form-group>
          <b-form-group
            id="form-edit-country-group"
            label="Country:"
            label-for="form-edit-country-input"
             :state="validationState(editAccountForm.country)"
          >
            <b-form-input
              id="form-edit-country-input"
              type="text"
              v-model="editAccountForm.country"
              placeholder="e.g. ES or US"
              :state="validationState(editAccountForm.country)"
              required
            >
            </b-form-input>
             <b-form-invalid-feedback :state="validationState(editAccountForm.country)">
                Country code must be 2 letters.
             </b-form-invalid-feedback>
          </b-form-group>
          <b-button type="submit" variant="outline-info" :disabled="!isEditFormValid">Update</b-button>
        </b-form>
      </b-modal>
      <!-- End of Modal for Edit Account-->
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AppAccounts",
  data() {
    return {
      accounts: [],
      createAccountForm: {
        name: "",
        currency: "",
        country: "",
      },
      editAccountForm: {
        id: "",
        name: "",
        country: "",
      },
      showMessage: false,
      message: "",
      searchQuery: "",
    };
  },
  computed: {
    filteredAccounts() {
      if (!this.searchQuery) {
        return this.accounts;
      }
      const query = this.searchQuery.toLowerCase();
      return this.accounts.filter(account => {
        return (
          account.name.toLowerCase().includes(query) ||
          account.account_number.toLowerCase().includes(query) ||
          account.currency.toLowerCase().includes(query) ||
          account.country.toLowerCase().includes(query) ||
          account.status.toLowerCase().includes(query)
        );
      });
    },
    isCreateFormValid() {
      return this.createAccountForm.name.length > 0 &&
             this.createAccountForm.currency.length > 0 &&
             this.validationState(this.createAccountForm.country) === true;
    },
    isEditFormValid() {
         return this.editAccountForm.name.length > 0 &&
                this.validationState(this.editAccountForm.country) === true;
    }
  },
  methods: {
    /***************************************************
     * RESTful requests
     ***************************************************/

    //GET function
    RESTgetAccounts() {
      const path = `${process.env.VUE_APP_ROOT_URL}/accounts`;
      axios
        .get(path)
        .then((response) => {
          this.accounts = response.data.accounts;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    // POST function
    RESTcreateAccount(payload) {
      const path = `${process.env.VUE_APP_ROOT_URL}/accounts`;
      axios
        .post(path, payload)
        .then((response) => {
          this.RESTgetAccounts();
          // For message alert
          this.message = "Account Created succesfully!";
          // To actually show the message
          this.showMessage = true;
          // To hide the message after 3 seconds
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
          this.RESTgetAccounts();
        });
    },

    // Update function
    RESTupdateAccount(payload, accountId) {
      const path = `${process.env.VUE_APP_ROOT_URL}/accounts/${accountId}`;
      axios
        .put(path, payload)
        .then((response) => {
          this.RESTgetAccounts();
          // For message alert
          this.message = "Account Updated succesfully!";
          // To actually show the message
          this.showMessage = true;
          // To hide the message after 3 seconds
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
          this.RESTgetAccounts();
        });
    },

    // Delete account
    RESTdeleteAccount(accountId) {
      const path = `${process.env.VUE_APP_ROOT_URL}/accounts/${accountId}`;
      axios
        .delete(path)
        .then((response) => {
          this.RESTgetAccounts();
          // For message alert
          this.message = "Account Deleted succesfully!";
          // To actually show the message
          this.showMessage = true;
          // To hide the message after 3 seconds
          setTimeout(() => {
            this.showMessage = false;
          }, 3000);
        })
        .catch((error) => {
          console.error(error);
          this.RESTgetAccounts();
        });
    },

    /***************************************************
     * FORM MANAGEMENT
     * *************************************************/

     // Frontend validation for 2-letter country code
     validationState(country) {
        if (country === null || country === undefined || country.length === 0) {
            return null; // No input yet
        }
        return country.length === 2 && /^[a-zA-Z]+$/.test(country);
     },

    // Initialize forms empty
    initForm() {
      this.createAccountForm.name = "";
      this.createAccountForm.currency = "";
      this.createAccountForm.country = "";
      this.editAccountForm.id = "";
      this.editAccountForm.name = "";
      this.editAccountForm.country = "";
    },

    // Handle submit event for create account
    onSubmit(e) {
      e.preventDefault(); //prevent default form submit form the browser
       if (this.isCreateFormValid) {
            this.$refs.addAccountModal.hide(); //hide the modal when submitted
            const payload = {
              name: this.createAccountForm.name,
              currency: this.createAccountForm.currency,
              country: this.createAccountForm.country, // Include country in the payload
            };
            this.RESTcreateAccount(payload);
            this.initForm();
       }
    },

    // Handle submit event for edit account
    onSubmitUpdate(e) {
      e.preventDefault(); //prevent default form submit form the browser
       if(this.isEditFormValid) {
            this.$refs.editAccountModal.hide(); //hide the modal when submitted
            const payload = {
              name: this.editAccountForm.name,
              country: this.editAccountForm.country,
            };
            this.RESTupdateAccount(payload, this.editAccountForm.id);
            this.initForm();
       }
    },

    // Handle edit button
    editAccount(account) {
      this.editAccountForm.id = account.id;
      this.editAccountForm.name = account.name;
      this.editAccountForm.country = account.country;
    },

    // Handle Delete button
    deleteAccount(account) {
      this.RESTdeleteAccount(account.id);
    },
  },

  /***************************************************
   * LIFECYClE HOOKS
   ***************************************************/
  created() {
    this.RESTgetAccounts();
  },
};
</script>

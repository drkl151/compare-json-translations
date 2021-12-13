<template>
  <div class="table">
    <Header
      @search-input="
        (value) => {
          searchKeys = value;
        }
      "
      :searchKeys="searchKeys"
    />

    <div class="filtration-block">
      <div class="color-designation-block">
        <div class="color-designation-prompt">
          <p>?</p>
          <ul class="color-designation">
            <li class="color-designation__yellow">
              Duplicates found in all files are highlighted in yellow.
            </li>
            <li class="color-designation__orange">
              Duplicates found in the same file (column) are highlighted in
              orange.
            </li>
            <li class="color-designation__red">
              Empty cells with no data are highlighted in red
            </li>
          </ul>
        </div>
      </div>

      <div class="filtration-block__checkbox">
        <input
          class="filtration-input"
          type="checkbox"
          id="unique"
          v-model="stringFilter.unique"
        />
        <label for="unique"> Unique data</label>
      </div>

      <div class="filtration-block__checkbox">
        <input
          class="filtration-input"
          type="checkbox"
          id="dupAllFiles"
          v-model="stringFilter.dupAllFiles"
        />
        <label for="dupAllFiles"> Duplicates of all files</label>
      </div>

      <div class="filtration-block__checkbox">
        <input
          class="filtration-input"
          type="checkbox"
          id="dupCurrentFile"
          v-model="stringFilter.dupCurrentFile"
        />
        <label for="dupCurrentFile"> Duplicates in one file</label>
      </div>

      <div class="filtration-block__checkbox">
        <input
          class="filtration-input"
          type="checkbox"
          id="empty"
          v-model="stringFilter.empty"
        />
        <label for="empty"> Not added data</label>
      </div>
    </div>

    <table
      v-if="Object.keys(dataTable).length"
      v-show="dataTable && isTableContent"
      ref="table"
    >
      <tr>
        <th>keys</th>
        <th v-for="fileName in Object.keys(dataTable)" :key="fileName">
          {{ fileName }}
          <span
            title="delete table column"
            @click="$emit('delete-table-column', fileName)"
            class="delete-table-column"
          ></span>
        </th>
      </tr>

      <tr
        v-for="[key, value] in searchingKeys"
        :key="key"
        :class="filters(value)"
      >
        <td class="keys">{{ key }}:</td>

        <template v-for="(fileName, index) in Object.keys(dataTable)">
          <td
            :class="defineClass(fileName, key)"
            v-if="value[fileName]"
            :key="value[fileName].content + index + fileName"
          >
            {{ value[fileName].content }}

            <h3
              @click="showDuplicate(fileName, value[fileName].content)"
              v-if="formattedData[key][fileName].index !== -1"
            >
              <img
                title="click to return all data"
                v-if="isDuplicatesFiltered"
                class="icon-duplicate"
                src="../../assets/icon-show.svg"
                alt="icon-show"
              />
              <img
                title="click to find duplicates"
                v-if="!isDuplicatesFiltered"
                class="icon-duplicate"
                src="../../assets/icon-hide.svg"
                alt="/icon-hide"
              />
            </h3>
          </td>

          <td :key="index" class="empty" v-else></td>
        </template>
      </tr>
    </table>

    <ErrorMessage v-show="!Object.keys(dataTable).length">
      <p class="error-message-content">Add data to get the result</p>
    </ErrorMessage>

    <ErrorMessage v-show="!isTableContent">
      <p class="error-message-content">Select the data you want to see</p>
      <button class="show-all-result-button" @click="showAllResult">
        Show all result
      </button>
    </ErrorMessage>
  </div>
</template>

<script>
import Header from "@/components/Header/Header";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

export default {
  data() {
    return {
      searchKeys: "",
      isTableContent: true,
      formattedData: {},
      constFormattedData: {},
      isDuplicatesFiltered: false,
      stringFilter: {
        unique: true,
        dupAllFiles: true,
        dupCurrentFile: true,
        empty: true,
      },
    };
  },

  components: { Header, ErrorMessage },

  props: {
    dataTable: {
      type: Object,
      required: true,
    },
  },

  watch: {
    dataTable: {
      handler() {
        this.formattingData();
      },
      deep: true,
    },
  },

  computed: {
    //search by keys
    searchingKeys() {
      if (this.searchKeys) {
        return Object.entries(this.formattedData).filter(([key]) => {
          return key.toLowerCase().includes(this.searchKeys.toLowerCase());
        });
      } else {
        return Object.entries(this.formattedData);
      }
    },
  },

  methods: {
    //data formatting
    formattingData() {
      if (Object.keys(this.dataTable).length) {
        const formattedObject = {};
        const duplicate = {};
        const generalArrayAllValues = [];

        Object.entries(this.dataTable).forEach(([dataKey, dataValue]) => {
          generalArrayAllValues.push(...Object.values(dataValue));

          const duplicateValue = Object.values(dataValue).filter(
            (item, index) => {
              return Object.values(dataValue).indexOf(item) !== index;
            }
          );

          duplicate[dataKey] = duplicateValue;
        });

        const duplicateAllArrays = generalArrayAllValues.filter(
          (item, index) => {
            return generalArrayAllValues.indexOf(item) !== index;
          }
        );

        Object.entries(this.dataTable).forEach(([dataKey, dataValue]) => {
          Object.entries(dataValue).forEach(([key, value]) => {
            formattedObject[key] = {
              ...formattedObject[key],
              [dataKey]: {
                content: value,
                isDuplicate: duplicate[dataKey].includes(value),
                index: duplicate[dataKey].indexOf(value),
                isDuplicateInAllArrays: duplicateAllArrays.includes(value),
              },
            };
          });
        });

        this.constFormattedData = formattedObject;
        this.formattedData = formattedObject;
      }
    },

    //show duplicates of the selected word
    showDuplicate(fileName, content) {
      if (this.isDuplicatesFiltered) {
        this.formattedData = this.constFormattedData;
        this.isDuplicatesFiltered = false;
      } else {
        const duplicateResult = {};

        Object.entries(this.formattedData).forEach(([key, el]) => {
          if (el[fileName] && el[fileName].content === content) {
            duplicateResult[key] = el;
          }
        });

        this.formattedData = duplicateResult;
        this.isDuplicatesFiltered = true;
      }
    },

    //get class according to string keys
    defineClass(fileName, key) {
      const contentObject = this.formattedData[key][fileName];

      if (contentObject.isDuplicate) {
        return "duplicate";
      } else if (contentObject.isDuplicateInAllArrays) {
        return "duplicateAllFiles";
      }
    },

    //get the class of the table row to filter
    filters(objectData) {
      const dataTableValues = Object.values(this.dataTable);
      const objectDataKeys = Object.keys(objectData);
      const objectDataValues = Object.values(objectData);

      //filter for unique strings
      if (
        objectDataValues.every(
          (el) => !el.isDuplicate && !el.isDuplicateInAllArrays
        ) &&
        this.stringFilter.unique &&
        objectDataKeys.length === dataTableValues.length
      ) {
        return;
      }

      //filter for duplicate strings in one file
      if (
        objectDataValues.some((el) => el.isDuplicate) &&
        this.stringFilter.dupCurrentFile
      ) {
        return;
      }

      //filter for duplicate strings in all files
      if (
        objectDataValues.some(
          (el) => el.isDuplicateInAllArrays && !el.isDuplicate
        ) &&
        this.stringFilter.dupAllFiles
      ) {
        return;
      }

      //filter for empty strings
      if (
        objectDataKeys.length !== dataTableValues.length &&
        this.stringFilter.empty
      ) {
        return;
      }

      return "hide";
    },

    //returns all checkboxes to true and clear searchKeys
    showAllResult() {
      this.stringFilter = {
        unique: true,
        dupAllFiles: true,
        dupCurrentFile: true,
        empty: true,
      };

      this.searchKeys = "";
    },
  },

  updated() {
    //checking for the presence of elements in the table
    if (!Object.keys(this.dataTable).length) {
      return;
    }

    let tableArrayChildren = [];
    let isTableContent = false;

    if (this.$refs.table) {
      tableArrayChildren = Array.prototype.slice.call(
        this.$refs.table.children
      );
      tableArrayChildren.shift();

      isTableContent = tableArrayChildren.some((tr) => tr.className !== "hide");

      this.isTableContent = isTableContent;
    }
  },

  mounted() {
    this.formattingData();
  },
};
</script>

<style lang="scss">
@import "Table.scss";
</style>

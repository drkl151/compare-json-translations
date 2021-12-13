<template>
  <div>
    <Table
      :dataTable="{ ...allData }"
      @delete-table-column="deleteTableColumn"
    />
  </div>
</template>

<script>
import Table from "@/components/Table/Table";
import allData from "@/compare-json-translations.config.js";

export default {
  data() {
    return {
      allData,
      deletedTableColumns: [],
    };
  },

  components: {
    Table,
  },

  methods: {
    deleteTableColumn(fileName) {
      this.deletedTableColumns = [...this.deletedTableColumns, fileName];
      const allDataWithoutDeletedTableColumns = Object.fromEntries(
        Object.entries(allData).filter(([key]) => {
          return !this.deletedTableColumns.includes(key);
        })
      );

      this.allData = allDataWithoutDeletedTableColumns;
    },
  },
};
</script>
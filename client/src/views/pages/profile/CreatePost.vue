<template>
  <v-app id="create_post">
    <v-container>
      <h2>Create Post</h2>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="title"
          :rules="titleRules"
          label="Title"
          required
        ></v-text-field>

        <v-textarea name="descriptions" label="Descriptions"></v-textarea>

        <v-text-field
          v-model="address"
          :rules="addressRules"
          label="Address"
          required
        ></v-text-field>

        <v-text-field v-model="price" type="number" label="Price">
        </v-text-field>

        <v-select :items="items" label="Area"></v-select>

        <v-file-input
          truncate-length="15"
          label="Choose images"
          multiple
        ></v-file-input>

        <v-checkbox
          v-model="checkbox"
          label="Do you have Furniture?"
        ></v-checkbox>

        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4"
          @click="validate"
        >
          Validate</v-btn
        >

        <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>
      </v-form>
    </v-container>
  </v-app>
</template>


<script>
export default {
  data: () => ({
    items: ["Foo", "Bar", "Fizz", "Buzz"],
  }),
};
</script>
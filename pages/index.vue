<template lang="pug">
section.container.mt-5: .card
  .card-body
    div.text-center: img.logo(src='~assets/img/logo.png', alt='Nuxt.js Logo')
    h4 USERS
    table.table.table-sm
      thead: tr
        th.border-top-0 Name
        th.border-top-0(width="30")
      tbody
        tr(v-for='(user, index) in users', :key='index')
          td 
            nuxt-link(:to="{ name: 'id', params: { id: user.id }}") {{ user.name }}
          td: a(href @click.prevent="removeUser(user.id)") &times;
    .input-group
      input.form-control(type='text' v-model="name")
      .input-group-append
        button.btn(@click="addUser")  Add 

</template>

<script>
import axios from "~/plugins/axios"

export default {
  data() {
    return {
      name: ""
    }
  },
  async asyncData() {
    let { data } = await axios.get("/api/users")
    return { users: data }
  },
  head() {
    return {
      title: "Users"
    }
  },
  methods: {
    async addUser() {
      console.log("click addUser")
      let user = {
        name: this.name
      }
      await axios.post("/api/users", user)
      this.name = ""

      await this.getUsers()
    },
    async removeUser(id) {
      console.log(id)
      await axios.delete(`/api/users/${id}`)
      await this.getUsers()
    },
    async getUsers() {
      let { data } = await axios.get("/api/users")
      this.users = data
    }
  }
}
</script>

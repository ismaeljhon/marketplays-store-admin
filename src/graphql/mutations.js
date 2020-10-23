import gql from 'graphql-tag'

export default {
    methods: {
        saveMutation(model, record) {
            if (record._id) { 
                return this.updateMutation(model, record)
            } else  {
                return this.createMutation(model, record)
            }
        },
        async createMutation(model, record) {
            return await this.$apollo.mutate({
                mutation: gql` 
                    mutation ${model}CreateOne($record: CreateOne${model}Input!) {
                        ${model}CreateOne(
                            record: $record
                        ){
                            record {
                                _id
                                name
                                code
                                description
                                slug
                                pricing
                                teamLead {
                                    _id
                                    fullName
                                    email
                                }
                            }
                        }
                    }
                `,
                variables: {
                    record: record
                },
            }).then(response => {
                return response.data[model+"CreateOne"].record
            }).catch(() => {
                swal({
                    title: "Error",
                    icon: "error",
                    text: `Something went wrong while adding ${model.toLowerCase()}`,
                })
                return false
            })
        },
        async updateMutation(model, record, _id) {
            return await this.$apollo.mutate({
                mutation: gql` 
                    mutation ${model}UpdateById($_id: MongoID!, $record: UpdateById${model}Input!) {
                        ${model}UpdateById(
                            _id: $_id
                            record: $record
                        ){
                            record {
                                _id
                                name
                                code
                                description
                                slug
                                pricing
                                teamLead {
                                    _id
                                    fullName
                                    email
                                }
                            }
                        }
                    }
                `,
                variables: {
                    _id: _id,
                    record: record
                },
            }).then(response => {
                return response.data[model+"UpdateById"].record
            }).catch(() => {
                swal({
                    title: "Error",
                    icon: "error",
                    text: `Something went wrong while updating ${model.toLowerCase()}`,
                })
                return false
            })
        },
        async deleteMutation(model, id) {
            return await this.$apollo.mutate({
                mutation: gql`
                    mutation ${model}RemoveById($id: MongoID!) {
                        ${model}RemoveById(
                            _id: $id
                        ) {
                            record {
                                name   
                            }
                        }
                    }
                `,
                variables: {
                    id: id
                },
            }).then(response => {
                return response.data[model+"RemoveById"].record
            }).catch(() => {
                swal({
                    title: "Error",
                    icon: "error",
                    text: `Something went wrong while deleting ${model.toLowerCase()}`,
                })
                return false
            })
        }
    }
}
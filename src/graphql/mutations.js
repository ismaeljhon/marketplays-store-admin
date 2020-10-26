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
                    mutation createOne${model}($record: CreateOne${model}Input!) {
                        createOne${model}(
                            record: $record
                        ){
                            record {
                                _id
                            }
                        }
                    }
                `,
                variables: {
                    record: record
                },
            }).then(response => {
                return response.data["createOne" + model].record
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
                    mutation update${model}ById($_id: MongoID!, $record: UpdateById${model}Input!) {
                        update${model}ById(
                            _id: $_id
                            record: $record
                        ){
                            record {
                                _id
                            }
                        }
                    }
                `,
                variables: {
                    _id: _id,
                    record: record
                },
            }).then(response => {
                return response.data["update" + model + "ById"].record
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
                    mutation remove${model}ById($id: MongoID!) {
                        remove${model}ById(
                            _id: $id
                        ) {
                            record {
                                _id   
                            }
                        }
                    }
                `,
                variables: {
                    id: id
                },
            }).then(response => {
                // return response.data[model+"RemoveById"].record
                return true
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
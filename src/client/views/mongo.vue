<template lang="html">
  <div class="mongo">
    <Button type="primary" @click="handleAdd" size="small">添加用户</Button>
    <Table :columns="columns" :data="users"></Table>
    <Page :current.sync="page" :page-size="10" :total="total" @on-change="getUsers" size="small"/>
    <Modal
      v-model="showModal"
      title="编辑用户"
      @on-ok="handleEditSave">
      <Form ref="editUser" :model="editUser" :rules="rules" :label-width="80">
        <Form-item label="姓名" prop="userName">
          <Input v-model="editUser.userName" placeholder="请输入姓名"></Input>
        </Form-item>
        <Form-item label="地址" prop="userAddr">
          <Input v-model="editUser.userAddr" placeholder="请输入地址"></Input>
        </Form-item>
        <Form-item label="年龄" prop="userAge">
          <Input v-model.number="editUser.userAge" placeholder="请输入年龄"></Input>
        </Form-item>
        <Form-item label="登录时间" prop="loginDate">
          <Date-picker v-model="editUser.loginDate" type="datetime" placeholder="选择日期和时间"></Date-picker>
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  data () {
    return {
      columns: [
        {
          title: '姓名',
          key: 'userName'
        },
        {
          title: '地址',
          key: 'userAddr'
        },
        {
          title: '年龄',
          key: 'userAge'
        },
        {
          title: '登录时间',
          render: (h, params) =>
            h(
              'span',
              dayjs(params.row.loginDate).format('YYYY-MM-DD HH:mm:ss')
            )
        },
        {
          title: '操作',
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h(
                'Button',
                {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handleEdit(params.row)
                    }
                  }
                },
                '编辑'
              ),
              h(
                'Button',
                {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.handleRemove(params.row._id)
                    }
                  }
                },
                '删除'
              )
            ])
          }
        }
      ],
      users: [],
      total: 0,
      page: 1,
      rules: {
        userName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        userAddr: [
          { required: true, message: '地址不能为空', trigger: 'blur' }
        ],
        userAge: [
          {
            required: true,
            type: 'number',
            message: '年龄格式不正确',
            trigger: 'blur'
          }
        ],
        loginDate: [
          {
            required: true,
            type: 'date',
            message: '请选择日期',
            trigger: 'change'
          }
        ]
      },
      showModal: false,
      editUser: {},
      isAdd: false
    }
  },
  created () {
    this.getUsers()
  },
  methods: {
    getUsers () {
      this.$http.get('/get-user', {
        params: {
          page: this.page
        }
      }).then(res => {
        this.users = res.users
        this.total = res.total
      })
    },
    handleEdit (user) {
      this.isAdd = false
      user.loginDate = new Date(user.loginDate)
      this.editUser = Object.assign({}, user)
      this.showModal = true
    },
    handleAdd () {
      this.isAdd = true
      this.editUser = {}
      this.showModal = true
    },
    handleRemove (id) {
      this.$Modal.confirm({
        title: '确认删除',
        content: '确认删除该用户的信息？',
        onOk: () => {
          this.$http.post('/remove-user', {
            data: { id }
          }).then(res => {
            if (res.success) {
              this.$Message.success('删除成功!')
              this.getUsers()
            } else {
              this.$Message.error('删除失败！')
            }
          })
        }
      })
    },
    handleEditSave () {
      this.$refs['editUser'].validate(valid => {
        if (valid) {
          let url = this.isAdd ? '/add-user' : '/edit-user'
          let message = this.isAdd ? '添加' : '编辑'
          this.$http.post(url, {
            data: this.editUser
          }).then(res => {
            if (res.success) {
              this.$Message.success(message + '成功!')
              this.getUsers()
            } else {
              this.$Message.error(message + '失败！')
            }
          })
        } else {
          this.$Message.error('请检查用户信息是否输入正确!')
        }
      })
    }
  }
}
</script>

<style lang="css" scoped>
.ivu-table-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 10px 0;
}
</style>

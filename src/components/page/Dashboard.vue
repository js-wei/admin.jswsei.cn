<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :lg="8" class="user">
        <el-row>
          <el-col>
            <el-card shadow="hover" class="user-info">
              <div class="head">
                <img src="static/images/10104372.gif" class="user-avator">
                <div class="user-info-cont">
                    <p>{{user.username}}</p>
                    <div>{{user.gid === -1 ? "超级管理员" : "普通用户"}}</div>
                </div>
              </div>
              <div class="user-info-list">
                <div class="tip">
                  最后登录时间：
                </div>
                <div class="ttp">{{user.last_date|formartDate}}</div>
              </div>
              <div class="user-info-list">
                <div class="tip">
                  最后登录的IP：
                </div>
                <div class="pull-right ttp">{{user.last_ip}}</div>
              </div>
              <div class="user-info-list">
                <div class="tip">
                  最后登录地点：
                </div>
                <div class="ttp">
                  {{user.last_address}}
                </div>
              </div>                            
            </el-card>
            <el-card shadow="hover" class="statistics">
              <div slot="header" class="clearfix">
                <span>订单统计</span>
              </div>
              <div class="progress">
                订单总数({{totalNum}})
                <el-progress :percentage="100" color="#f56c6c" ></el-progress>
                订单支付({{payFor}})
                <el-progress :percentage="Math.round(payFor / totalNum * 10000) / 100.00" 
                color="#42b983"></el-progress>
                取消订单({{cancelNum}})
                <el-progress :percentage="Math.round(cancelNum / totalNum * 10000) / 100.00"></el-progress>
                无效订单({{disOrder}})
                <el-progress :percentage="Math.round(disOrder / totalNum * 10000) / 100.00" 
                color="#f56c6c"></el-progress>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="16" class="grid">
        <el-row :gutter="20">
            <el-col :span="8">
              <el-card shadow="hover" :body-style="{padding: '0px'}">
                <div class="grid-content grid-con-1">
                  <i class="el-icon-view grid-con-icon"></i>
                  <div class="grid-cont-right">
                    <div class="grid-num">1234</div>
                    <div>用户访问量</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" :body-style="{padding: '0px'}">
                <div class="grid-content grid-con-2">
                  <i class="el-icon-message grid-con-icon"></i>
                  <div class="grid-cont-right">
                      <div class="grid-num">321</div>
                      <div>系统消息</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="8">
              <el-card shadow="hover" :body-style="{padding: '0px'}">
                <div class="grid-content grid-con-3">
                  <i class="el-icon-goods grid-con-icon"></i>
                  <div class="grid-cont-right">
                    <div class="grid-num">5000</div>
                    <div>数量</div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row class="todo">
            <el-card shadow="hover" :body-style="{ height: '304px'}">
              <div slot="header" class="clearfix">
                <span class="text-primary">最新消息</span>
                <router-link to="/message" class="text-primary pull-right">更多</router-link>
              </div>
              <el-table :data="todoList" :show-header="false" height="304">
                <el-table-column width="40">
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.status"></el-checkbox>
                  </template>
                </el-table-column>
                <el-table-column>
                  <template slot-scope="scope">
                    <div class="todo-item" :class="{'todo-item-del': scope.row.status}">
                      {{scope.row.title}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column width="60">
                  <template slot-scope="scope">
                    <i class="el-icon-edit"></i>
                    <i class="el-icon-delete"></i>
                  </template>
                </el-table-column>
              </el-table>
            </el-card>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      todoList: [
        { title: '测试', status: false },
        { title: '测试2', status: true },
        { title: '测试3', status: false }
      ],
      msgCount: 0,
      totalNum: 3000,
      payFor: 2800,
      cancelNum: 120,
      disOrder: 80
    }
  },
  computed: {
    ...mapState({
      user: state => state.mutations.logined
    })
  },
  created () {
    if (this.msgCount) {
      this.$notify({
        title: '消息通知',
        duration: 5e3,
        dangerouslyUseHTMLString: true,
        message: `您有
          <a href="/message" style="font-size:16px;" class="text-danger pointer">${
            this.msgCount
          }</a>
          条,新的消息等待处理!!<video src="../../../static/11.wav" autoplay class="hide"></video>`,
        position: 'top-right'
      })
    }
  },
  filters: {
    filterAddress: function (value, index = 0) {
      if (!value) return
      value = value.split(',')
      return value[index]
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/base";
.user {
  height: 550px;
  margin-bottom: 22px;
  .user-info {
    height: 250px;
    margin-bottom: 20px;
    .head {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #ccc;
      margin-bottom: 20px;
      .user-avator {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }
      .user-info-cont {
        padding-left: 15px;
        flex: 1;
        font-size: 14px;
        color: #999;
        p {
          font-size: 1.5rem;
          color: #000;
        }
      }
    }
    .user-info-list {
      font-size: 1.2rem;
      color: #999;
      line-height: 1.8rem;
      margin-left: 0.8px;
      display: flex;
      div {
        flex-direction: row;
        &:nth-of-type(1) {
          width: 35%;
        }
        &:nth-of-type(2) {
          width: 65%;
          text-align: right;
        }
      }
    }
  }
  .statistics {
    height: 247px;
    .progress {
      margin-left: 5px;
    }
  }
}
.grid {
  height: 550px;
  .grid-content {
    display: flex;
    align-items: center;
    height: 100px;
  }
  .grid-cont-right {
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: #999;
  }
  .grid-num {
    font-size: 30px;
    font-weight: bold;
  }
  .grid-con-icon {
    font-size: 50px;
    width: 100px;
    height: 100px;
    text-align: center;
    line-height: 100px;
    color: #fff;
  }
  .grid-con-1 {
    .grid-con-icon {
      background: rgb(45, 140, 240);
    }
    .grid-num {
      color: rgb(45, 140, 240);
    }
  }
  .grid-con-2 {
    .grid-con-icon {
      background: rgb(100, 213, 114);
    }
    .grid-num {
      color: rgb(45, 140, 240);
    }
  }
  .grid-con-3 {
    .grid-con-icon {
      background: rgb(242, 94, 67);
    }
    .grid-num {
      color: rgb(242, 94, 67);
    }
  }
}
.todo {
  font-size: 1.5rem;
  height: 400px;
  width: 100%;
  margin-top: 15px;
  .todo-item {
    font-size: 14px;
    &.todo-item-del {
      text-decoration: line-through;
      color: #999;
    }
  }
}
</style>
<style>
.el-progress-bar {
  width: 98%;
}
</style>
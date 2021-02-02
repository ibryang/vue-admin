<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-row :gutter="20">
          <!--部门数据-->
          <el-col :span="4" :xs="24">
            <div class="head-container">
              <el-input
                v-model="dept_name"
                placeholder="请输入部门名称"
                clearable
                size="small"
                prefix-icon="el-icon-search"
                style="margin-bottom: 20px"
              />
            </div>
            <div class="head-container">
              <el-tree
                ref="tree"
                :data="dept_options"
                :props="defaultProps"
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                default-expand-all
                @node-click="handleNodeClick"
              />
            </div>
          </el-col>
          <!--用户数据-->
          <el-col :span="20" :xs="24">
            <el-form
              ref="queryForm"
              :model="queryParams"
              :inline="true"
              label-width="68px"
            >
              <el-form-item label="用户名称" prop="username">
                <el-input
                  v-model="queryParams.username"
                  placeholder="请输入用户名称"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="手机号码" prop="phone">
                <el-input
                  v-model="queryParams.phone"
                  placeholder="请输入手机号码"
                  clearable
                  size="small"
                  style="width: 240px"
                  @keyup.enter.native="handleQuery"
                />
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="queryParams.status"
                  placeholder="用户状态"
                  clearable
                  size="small"
                  style="width: 240px"
                >
                  <el-option
                    v-for="dict in statusOptions"
                    :key="dict.dictValue"
                    :label="dict.dictLabel"
                    :value="dict.dictValue"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  size="mini"
                  @click="handleQuery"
                  >搜索</el-button
                >
                <el-button
                  icon="el-icon-refresh"
                  size="mini"
                  @click="resetQuery"
                  >重置</el-button
                >
              </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
              <el-col :span="1.5">
                <el-button
                  v-permisaction="['system:sysuser:add']"
                  type="primary"
                  icon="el-icon-plus"
                  size="mini"
                  @click="handleAdd"
                  >新增</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button
                  v-permisaction="['system:sysuser:edit']"
                  type="success"
                  icon="el-icon-edit"
                  size="mini"
                  :disabled="single"
                  @click="handleUpdate"
                  >修改</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button
                  v-permisaction="['system:sysuser:remove']"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  :disabled="multiple"
                  @click="handleDelete"
                  >删除</el-button
                >
              </el-col>
            </el-row>

            <el-table
              v-loading="loading"
              :data="userList"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="45" align="center" />
              <el-table-column
                label="编号"
                width="50"
                align="center"
                prop="user_id"
              />
              <el-table-column
                label="用户名称"
                align="center"
                prop="username"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="用户昵称"
                align="center"
                prop="nick_name"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="部门"
                align="center"
                prop="dept_name"
                :show-overflow-tooltip="true"
              />
              <el-table-column
                label="手机号码"
                align="center"
                prop="phone"
                width="120"
              />
              <el-table-column label="状态" width="50" align="center">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.status"
                    active-value="2"
                    inactive-value="1"
                    @change="handleStatusChange(scope.row)"
                  />
                </template>
              </el-table-column>
              <el-table-column
                label="创建时间"
                align="center"
                prop="created_at"
                width="165"
              >
                <template slot-scope="scope">
                  <span>{{ parseTime(scope.row.created_at) }}</span>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                align="center"
                width="220"
                class-name="small-padding fixed-width"
              >
                <template slot-scope="scope">
                  <el-button
                    v-permisaction="['system:sysuser:edit']"
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleUpdate(scope.row)"
                    >修改</el-button
                  >
                  <el-button
                    v-if="scope.row.user_id !== 1"
                    v-permisaction="['system:sysuser:remove']"
                    size="mini"
                    type="text"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.row)"
                    >删除</el-button
                  >
                  <el-button
                    v-permisaction="['system:sysuser:resetPassword']"
                    size="mini"
                    type="text"
                    icon="el-icon-key"
                    @click="handleResetPwd(scope.row)"
                    >重置</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="queryParams.page"
              :limit.sync="queryParams.page_size"
              @pagination="getList"
            />
          </el-col>
        </el-row>
      </el-card>
      <!-- 添加或修改参数配置对话框 -->
      <el-dialog :title="title" :visible.sync="open" width="600px">
        <el-form ref="form" :model="form" :rules="rules" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户昵称" prop="nick_name">
                <el-input
                  v-model="form.nick_name"
                  placeholder="请输入用户昵称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="归属部门" prop="dept_id">
                <treeselect
                  v-model="form.dept_id"
                  :options="dept_options"
                  :normalizer="normalizer"
                  placeholder="请选择归属部门"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码" prop="phone">
                <el-input
                  v-model="form.phone"
                  placeholder="请输入手机号码"
                  maxlength="11"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱" prop="email">
                <el-input
                  v-model="form.email"
                  placeholder="请输入邮箱"
                  maxlength="50"
                  clearable
                />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名称" prop="username">
                <el-input
                  v-if="title !== '添加用户'"
                  v-model="form.username"
                  placeholder="请输入用户名称"
                  disabled
                /><el-input
                  v-else
                  v-model="form.username"
                  placeholder="请输入用户名称"
                  clearable
                />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="12">
              <el-form-item
                v-if="form.user_id == undefined"
                label="用户密码"
                prop="password"
              >
                <el-input
                  v-model="form.password"
                  placeholder="请输入用户密码"
                  type="password"
                  clearable
                />
              </el-form-item>
            </el-col> -->
            <el-col :span="12">
              <el-form-item label="用户性别">
                <el-select v-model="form.sex" placeholder="请选择">
                  <el-option label="男" value="0" />
                  <el-option label="女" value="1" />
                  <el-option label="保密" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="状态">
                <el-radio v-model="form.status" label="2">启用</el-radio>
                <el-radio v-model="form.status" label="1">锁定</el-radio>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="岗位">
                <el-select
                  v-model="form.post_id"
                  placeholder="请选择"
                  @change="$forceUpdate()"
                >
                  <el-option
                    v-for="item in postOptions"
                    :key="item.post_id"
                    :label="item.post_name"
                    :value="item.post_id"
                    :disabled="item.status == 1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色">
                <el-select
                  v-model="form.role_id"
                  placeholder="请选择"
                  @change="$forceUpdate()"
                >
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.role_id"
                    :label="item.role_name"
                    :value="item.role_id"
                    :disabled="item.status == 1"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  v-model="form.remark"
                  type="textarea"
                  clearable
                  placeholder="请输入内容"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </el-dialog>
      <!-- 用户导入对话框 -->
      <el-dialog
        :title="upload.title"
        :visible.sync="upload.open"
        width="400px"
      >
        <el-upload
          ref="upload"
          :limit="1"
          accept=".xlsx, .xls"
          :headers="upload.headers"
          :action="upload.url + '?updateSupport=' + upload.updateSupport"
          :disabled="upload.isUploading"
          :on-progress="handleFileUploadProgress"
          :on-success="handleFileSuccess"
          :auto-upload="false"
          drag
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
          <div slot="tip" class="el-upload__tip">
            <el-checkbox
              v-model="upload.updateSupport"
            />是否更新已经存在的用户数据
            <el-link type="info" style="font-size: 12px" @click="importTemplate"
              >下载模板</el-link
            >
          </div>
          <div slot="tip" class="el-upload__tip" style="color: red">
            提示：仅允许导入“xls”或“xlsx”格式文件！
          </div>
        </el-upload>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitFileForm">确 定</el-button>
          <el-button @click="upload.open = false">取 消</el-button>
        </div>
      </el-dialog>
    </template>
  </BasicLayout>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  exportUser,
  resetUserPwd,
  changeUserStatus,
  importTemplate,
  getUserInit,
} from "@/api/system/sysuser";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      dept_options: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      dept_name: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label",
      },
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData",
      },
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 10,
        username: undefined,
        phone: undefined,
        status: undefined,
        dept_id: undefined,
      },
      // 表单校验
      rules: {
        username: [
          { required: true, message: "用户名称不能为空", trigger: "blur" },
        ],
        nick_name: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" },
        ],
        dept_id: [
          { required: true, message: "归属部门不能为空", trigger: "blur" },
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱地址不能为空", trigger: "blur" },
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          { required: true, message: "手机号码不能为空", trigger: "blur" },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选部门树
    dept_name(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.getList();
    this.getTreeselect();
    // this.getDicts('sys_normal_disable').then(response => {
    //   this.statusOptions = response.data
    // })
    // this.getConfigKey('sys.user.initPassword').then(response => {
    //   this.initPassword = response.data.configValue
    // })
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.userList = response.data.list;
          this.total = response.data.total;
          this.loading = false;
        }
      );
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect().then((response) => {
        this.dept_options = response.depts;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.dept_name.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.dept_id = data.id;
      this.getList();
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.label,
        children: node.children,
      };
    },
    // 用户状态修改
    handleStatusChange(row) {
      const text = row.status === "2" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.username + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return changeUserStatus(row.user_id, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "2" ? "1" : "2";
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        user_id: undefined,
        dept_id: undefined,
        username: undefined,
        nick_name: undefined,
        password: undefined,
        phone: undefined,
        email: undefined,
        sex: undefined,
        status: "2",
        remark: undefined,
        postIds: undefined,
        roleIds: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.user_id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      // this.getTreeselect();
      getUserInit().then((response) => {
        this.postOptions = response.data.posts;
        this.roleOptions = response.data.roles;
        this.open = true;
        this.title = "添加用户";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      // this.getTreeselect();

      const user_id = row.user_id || this.ids;
      getUser(user_id).then((response) => {
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.form.postIds = response.data.post_id;
        this.form.roleIds = response.data.role_id;
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$confirm('确定重置"' + row.username + '"的密码吗', "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          resetUserPwd(row.user_id, "reset_user_pwd").then((response) => {
            this.msgSuccess(response.message);
          });
        })
        .catch(() => {});
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.user_id !== undefined) {
            updateUser(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addUser(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const user_ids = row.user_id || this.ids;
      var _this = this;
      this.$confirm(
        '是否确认删除用户编号为"' + user_ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          delUser(user_ids).then((res) => {
            console.log(res);
            _this.getList();
            _this.msgSuccess(res.message);
          });
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm("是否确认导出所有用户数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(function () {
          return exportUser(queryParams);
        })
        .then((response) => {
          this.download(response.msg);
        })
        .catch(function () {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then((response) => {
        this.download(response.msg);
      });
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
  },
};
</script>

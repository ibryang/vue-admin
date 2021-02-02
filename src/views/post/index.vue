<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form
          ref="queryForm"
          :model="queryParams"
          :inline="true"
          label-width="68px"
        >
          <el-form-item label="岗位编码" prop="post_code">
            <el-input
              v-model="queryParams.post_code"
              placeholder="请输入岗位编码"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="岗位名称" prop="post_name">
            <el-input
              v-model="queryParams.post_name"
              placeholder="请输入岗位名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="岗位状态"
              clearable
              size="small"
            >
              <el-option label="正常" value="2" />
              <el-option label="锁定" value="1" />
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
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
              >重置</el-button
            >
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:syspost:add']"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:syspost:edit']"
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
              v-permisaction="['system:syspost:remove']"
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button
              v-permisaction="['system:syspost:export']"
              type="warning"
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              >导出</el-button
            >
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="postList"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column
            label="岗位编号"
            width="80"
            align="center"
            prop="post_id"
          />
          <el-table-column label="岗位编码" align="center" prop="post_code" />
          <el-table-column label="岗位名称" align="center" prop="post_name" />
          <el-table-column label="岗位排序" align="center" prop="sort" />
          <el-table-column
            label="状态"
            align="center"
            prop="status"
            :formatter="statusFormat"
          >
            <template slot-scope="scope">
              <el-tag
                :type="scope.row.status === '1' ? 'danger' : 'success'"
                disable-transitions
                >{{ scope.row.status === "1" ? "锁定" : "正常" }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column
            label="创建时间"
            align="center"
            prop="created_at"
            width="180"
          >
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.created_at) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                v-permisaction="['system:syspost:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <el-button
                v-permisaction="['system:syspost:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
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

        <!-- 添加或修改岗位对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="500px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="岗位名称" prop="post_name">
              <el-input v-model="form.post_name" placeholder="请输入岗位名称" />
            </el-form-item>
            <el-form-item label="岗位编码" prop="post_code">
              <el-input v-model="form.post_code" placeholder="请输入编码名称" />
            </el-form-item>
            <el-form-item label="岗位顺序" prop="sort">
              <el-input-number
                v-model="form.sort"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
            <el-form-item label="岗位状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="2">正常</el-radio>
                <el-radio label="1">锁定</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm">确 定</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </el-dialog>
      </el-card>
    </template>
  </BasicLayout>
</template>

<script>
import {
  listPost,
  getPost,
  delPost,
  addPost,
  updatePost,
} from "@/api/system/post";
import { formatJson } from "@/utils";

export default {
  name: "Post",
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
      // 岗位表格数据
      postList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        page: 1,
        page_size: 10,
        post_code: undefined,
        post_name: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        post_name: [
          { required: true, message: "岗位名称不能为空", trigger: "blur" },
        ],
        post_code: [
          { required: true, message: "岗位编码不能为空", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "岗位顺序不能为空", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询岗位列表 */
    getList() {
      this.loading = true;
      listPost(this.queryParams).then((response) => {
        this.postList = response.data.list;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 岗位状态字典翻译
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, row.status);
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        post_id: undefined,
        post_code: undefined,
        post_name: undefined,
        sort: 0,
        status: "0",
        remark: undefined,
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
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.post_id);
      this.single = selection.length !== 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加岗位";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();

      const post_id = row.post_id || this.ids;
      getPost(post_id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改岗位";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.post_id !== undefined) {
            updatePost(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addPost(this.form).then((response) => {
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
      const post_ids = row.post_id || this.ids;
      this.$confirm(
        '是否确认删除岗位编号为"' + post_ids + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delPost(post_ids);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
    /** 导出按钮操作 */
    handleExport() {
      // const queryParams = this.queryParams
      this.$confirm("是否确认导出所有岗位数据项?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.downloadLoading = true;
          import("@/vendor/Export2Excel").then((excel) => {
            const tHeader = [
              "岗位编号",
              "岗位编码",
              "岗位名称",
              "排序",
              "创建时间",
            ];
            const filterVal = [
              "post_id",
              "post_code",
              "post_name",
              "sort",
              "created_at",
            ];
            const list = this.postList;
            const data = formatJson(filterVal, list);
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename: "岗位管理",
              autoWidth: true, // Optional
              bookType: "xlsx", // Optional
            });
            this.downloadLoading = false;
          });
        })
        .catch(function () {});
    },
  },
};
</script>

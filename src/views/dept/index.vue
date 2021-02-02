<template>
  <BasicLayout>
    <template #wrapper>
      <el-card class="box-card">
        <el-form :inline="true">
          <el-form-item label="部门名称">
            <el-input
              v-model="queryParams.dept_name"
              placeholder="请输入部门名称"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-select
              v-model="queryParams.status"
              placeholder="部门状态"
              clearable
              size="small"
            >
              <el-option label="正常" value="2" />
              <el-option label="锁定" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="handleQuery"
              >搜索</el-button
            >
            <el-button
              v-permisaction="['system:sysdept:add']"
              class="filter-item"
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              >新增</el-button
            >
          </el-form-item>
        </el-form>

        <el-table
          v-loading="loading"
          :data="deptList"
          row-key="dept_id"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column prop="dept_name" label="部门名称" />
          <el-table-column prop="sort" label="排序" width="200" />
          <el-table-column
            prop="status"
            label="状态"
            :formatter="statusFormat"
            width="100"
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
            width="200"
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
                v-permisaction="['system:sysdept:edit']"
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                >修改</el-button
              >
              <el-button
                v-permisaction="['system:sysdept:add']"
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="handleAdd(scope.row)"
                >新增</el-button
              >
              <el-button
                v-if="scope.row.p_id != 0"
                v-permisaction="['system:sysdept:remove']"
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <!-- 添加或修改部门对话框 -->
        <el-dialog :title="title" :visible.sync="open" width="600px">
          <el-form ref="form" :model="form" :rules="rules" label-width="80px">
            <el-row>
              <el-col :span="24">
                <el-form-item label="上级部门" prop="parent_id">
                  <treeselect
                    v-model="form.parent_id"
                    :options="deptOptions"
                    :normalizer="normalizer"
                    :show-count="true"
                    placeholder="选择上级部门"
                    :is-disabled="isEdit"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门名称" prop="dept_name">
                  <el-input
                    v-model="form.dept_name"
                    placeholder="请输入部门名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="显示排序" prop="orderNum">
                  <el-input-number
                    v-model="form.sort"
                    controls-position="right"
                    :min="0"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="负责人" prop="leader">
                  <el-input
                    v-model="form.leader"
                    placeholder="请输入负责人"
                    maxlength="20"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="联系电话" prop="phone">
                  <el-input
                    v-model="form.phone"
                    placeholder="请输入联系电话"
                    maxlength="11"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="邮箱" prop="email">
                  <el-input
                    v-model="form.email"
                    placeholder="请输入邮箱"
                    maxlength="50"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="部门状态">
                  <el-radio-group v-model="form.status">
                    <el-radio label="2">正常</el-radio>
                    <el-radio label="1">锁定</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
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
  getDeptList,
  getDept,
  delDept,
  addDept,
  updateDept,
} from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Dept",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 表格树数据
      deptList: [],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      isEdit: false,
      // 是否显示弹出层
      open: false,
      // 状态数据字典
      statusOptions: [],
      // 查询参数
      queryParams: {
        dept_name: undefined,
        status: undefined,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parent_id: [
          { required: true, message: "上级部门不能为空", trigger: "blur" },
        ],
        dept_name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
        ],
        sort: [
          { required: true, message: "菜单顺序不能为空", trigger: "blur" },
        ],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"],
          },
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      getDeptList(this.queryParams).then((response) => {
        this.deptList = response.data;
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.dept_id,
        label: node.dept_name,
        children: node.children,
      };
    },
    /** 查询部门下拉树结构 */
    getTreeselect(e) {
      // getDeptList().then((response) => {
        this.deptOptions = [];

        if (e === "update") {
          const dept = {
            dept_id: 0,
            dept_name: "主类目",
            children: [],
            isDisabled: true,
          };
          // dept.children = response.data;
          dept.children = this.deptList;
          this.deptOptions.push(dept);
        } else {
          const dept = { dept_id: 0, dept_name: "主类目", children: [] };
          // dept.children = response.data;
          dept.children = this.deptList;
          this.deptOptions.push(dept);
        }
      // });
    },
    // 字典状态字典翻译
    statusFormat(row) {
      return this.selectDictLabel(this.statusOptions, parseInt(row.status));
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dept_id: undefined,
        parent_id: undefined,
        dept_name: undefined,
        sorc: undefined,
        leader: undefined,
        phone: undefined,
        email: undefined,
        status: "0",
      };
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.getTreeselect("add");
      if (row !== undefined) {
        this.form.parent_id = row.dept_id;
      }
      this.open = true;
      this.title = "添加部门";
      this.isEdit = false;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.getTreeselect("update");

      getDept(row.dept_id).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改部门";
        this.isEdit = true;
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.dept_id !== undefined) {
            updateDept(this.form).then((response) => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addDept(this.form).then((response) => {
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
      this.$confirm(
        '是否确认删除名称为"' + row.dept_name + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(function () {
          return delDept(row.dept_id);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        })
        .catch(function () {});
    },
  },
};
</script>

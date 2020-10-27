
import React from "react";
import { useSelector } from "react-redux";
import { useHistory} from 'react-router-dom'
import { Button, Form, Input,notification,Select } from "antd";
import { SmileOutlined ,FrownTwoTone} from '@ant-design/icons';
import { CloseOutlined } from "@ant-design/icons";
import { addPosts } from "../../api/api";
import './Register.scss'


const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const Register = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const isLogined = useSelector(state => state.user.isLogined)
  const LoginedUser = useSelector(state => state.user.loginedUser)

  const mapCategoty = {'share':1,'discuss':2,'complain':3,'compliment':4}

  const onFinish = (values) => {
    if(isLogined){
      let title = form.getFieldValue().title
      let category = form.getFieldValue().category
      let content = form.getFieldValue().content
      let categoryId = mapCategoty[category]
      debugger

      addPosts(LoginedUser.userId,title,content,categoryId).then(res => {
        if(res.data.code == 0){
          notification.open({
            message: '发帖成功！',
            description:
              '发帖成功，已为您自动跳转:)',
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
          });
          history.go(-1)
          form.resetFields();
        }else {
          notification.open({
            message: '发帖失败！',
            description:
              '发生了未知错误，抱歉',
            icon: <FrownTwoTone style={{ color: '#ff4c4c' }} />,
          });
        }
      })
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  }

  const onReset = () => {
    form.resetFields();
  }


  return (
    <div className="create-post">
      <div className="container">
      <div className="header">发布新主题</div>
      <Button className="close" icon={<CloseOutlined />}></Button>
      <Form
      {...layout}
      name="basic"
      initialValues={
        {remember: true}
      }
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form={form}
      >
        <Form.Item
        label="标题"
        name="title"
        rules={[
          {
            required:true,
            message: '请输入一个标题'
          }
        ]}
        >
          <Input.TextArea></Input.TextArea>

        </Form.Item>
        <Form.Item label="分类" name="category"
                rules={[
                  {
                    required:true,
                    message: '请选择一个分类'
                  }
                ]}
        >
          <Select>
            <Select.Option value="share">分享</Select.Option>
            <Select.Option value="discuss">讨论</Select.Option>
            <Select.Option value="complain">吐槽</Select.Option>
            <Select.Option value="compliment">夸夸</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
        label="内容"
        name="content"
        rules={[
          {
            required:true,
            message: '请输入内容'
          }
        ]}
        >
          <Input.TextArea rows={4} ></Input.TextArea>

        </Form.Item>
        <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset} className="reset">
          Reset
        </Button>
      </Form.Item>

      </Form>
      </div>
    </div>
   );
}

export default Register;


import React,{useState} from "react";
import { useSelector } from "react-redux";
import { useHistory} from 'react-router-dom'
import { Button, Form, Input,notification,Upload } from "antd";
import { SmileOutlined ,FrownTwoTone,UploadOutlined} from '@ant-design/icons';
import { CloseOutlined } from "@ant-design/icons";
import { register } from "../../api/api";
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


  const [avator, setAvator] = useState({});

  const onFinish = (values) => {

    if(!isLogined){
      let name = form.getFieldValue().name
      let password = form.getFieldValue().password
      let email = form.getFieldValue().email
      let formData = new FormData()
      formData.append('name',name)
      formData.append('password',password)
      formData.append('email',email)
      formData.append('avator',avator,avator.name)



      register(formData).then(res => {
        console.log(res)
        if(res.data.code == 0){
          notification.open({
            message: '注册成功！',
            description:
              '您已成功注册，请登录:)',
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
          });
          history.push('/login')
          form.resetFields();
        }else {
          notification.open({
            message: '注册失败！',
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

  const normFile = e => {

    if (Array.isArray(e)) {
      return e;
    }
    // console.log(e)
    setAvator(e.file)
    return e && e.fileList;
  };


  //这样可以阻止头像默认上传
  const handleBeforeUpload = (file,size) => {
    return false
  }


  return (
    <div className="register">
      <div className="container">
      <div className="header">注册</div>
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
        label="姓名"
        name="name"
        rules={[
          {
            required:true,
            message: '请输入您的姓名'
          }
        ]}
        >
          <Input></Input>

        </Form.Item>
        <Form.Item label="密码" name="password"
                rules={[
                  {
                    required:true,
                    message: '请输入密码'
                  }
                ]}
        >
          <Input.Password></Input.Password>
        </Form.Item>
        <Form.Item
        label="邮箱"
        name="email"
        rules={[
          {
            required:true,
            message: '请输入邮箱'
          }
        ]}
        >
          <Input></Input>

        </Form.Item>
        <Form.Item label="上传头像" name="avator"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        >
        <Upload name="logo" listType="picture" beforeUpload={handleBeforeUpload}>
          <Button icon={<UploadOutlined />}>Click to upload</Button>
        </Upload>
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

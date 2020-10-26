import React from "react";
import { useSelector,useDispatch } from "react-redux";
import { useHistory} from 'react-router-dom'
import { Button, Form, Input, Checkbox,notification } from "antd";
import { SmileOutlined ,FrownTwoTone} from '@ant-design/icons';
import { CloseOutlined } from "@ant-design/icons";
import { login } from "../../api/api";
import './Login.scss'


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

const Login = () => {
  const [form] = Form.useForm()
  const history = useHistory()
  const isLogined = useSelector(state => state.isLogined)
  const dispatch = useDispatch()

  const onFinish = (values) => {
    if(!isLogined){
      let name = form.getFieldValue().username
      let password = form.getFieldValue().password
      login(name,password).then(res => {
        if(res.data.code === -2){
          notification.open({
            message: '用户未注册！',
            description:
              '用户名错误，您可能还未注册，请注册之后再重新登录',
            icon: <FrownTwoTone style={{ color: '#ff4c4c' }} />,
          });
        }else if(res.data.code === -1){
          notification.open({
            message: '密码错误！',
            description:
              '登录密码错误，重新登录',
            icon: <FrownTwoTone style={{ color: '#ff4c4c' }} />,
          });
        }else {
          notification.open({
            message: '登录成功！',
            description:
              '您已成功登录，现在你可以发布新帖子，或者回复其他人的帖子,希望您在 前端小组 里玩的愉快:)',
            icon: <SmileOutlined style={{ color: '#108ee9' }} />,
          });
          dispatch({type:'set-isLogined',payload:true})
          dispatch({type:'set-loginedUser',payload:res.data.user})
          form.resetFields();
          history.go(-1)
        }
      })
      console.log('Success:', values);

    }else{
      notification.open({
        message: '请勿重复登录！',
        description:
          '您已登录，请勿重复登录，如果您要切换账号，请登出后再登录！',
        icon: <FrownTwoTone style={{ color: '#ff4c4c' }} />,
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onReset = () => {
    form.resetFields();
  }

  return (
    <div className="user-login">
      <div className="header">登录</div>
      <Button className="close" icon={<CloseOutlined />}></Button>
      <Form
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      form = {form}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[
          {
            required: true,
            message: 'Please input your username!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your password!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button htmlType="button" onClick={onReset}>
          Reset
        </Button>
      </Form.Item>
    </Form>
    </div>
  );
};

export default Login;

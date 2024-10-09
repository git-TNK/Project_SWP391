import { Button, Form, Input } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

function LoginPage() {
  const [dataSource, setDataSource] = useState(null);

  const onFinish = (values) => {
    console.log("Success:", values);
    const userName = values.username;
    const password = values.password;

    console.log("Username: ", userName);
    console.log("Password: ", password);
    fetchAccount(userName, password);
  };

  async function fetchAccount(userName, password) {
    try {
      const response = await axios.get(
        `http://localhost:5056/api/Account/${userName},${password}`
      );
      setDataSource(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(function () {
    fetchAccount("userName", "password");
  }, []);

  console.log(dataSource);

  return (
    <div>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Ten Dang Nhap"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mat Khau"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          wrapperCol={{
            offset: 8,
            span: 16,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default LoginPage;

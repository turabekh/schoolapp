import React, { useState, useContext } from "react";
import { Form, Input, Button, Typography, message, Divider, Card } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "src/authentication/AuthProvider";


const { Title } = Typography;

function Login() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();


    const onFinish = (values) => {
        setLoading(true);
        login(values?.email, values?.password)
            .then(() => {
                setLoading(false);
                message.success("Login successful.")
                navigate("/")
            })
            .catch((err) => {
                message.error("Login failed. Please try again.")
                setLoading(false);
            });
    }
    return (
        <Card style={{ maxWidth: 400, margin: "20px auto", padding: "20px" }}>
            <Title level={2} style={{ textAlign: "center" }}>
                Login
            </Title>
            <Form
                form={form}
                name="login"
                onFinish={onFinish}
                scrollToFirstError
                layout="vertical"
            >
    
                <Form.Item
                    name="email"
                    label="E-mail"
                    rules={[
                        {
                            type: "email",
                            message: "The input is not valid E-mail!",
                        },
                        {
                            required: true,
                            message: "Please input your E-mail!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
    
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[
                        {
                            required: true,
                            message: "Please input your password!",
                        },
                    ]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>
    
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Log In
                    </Button>
                </Form.Item>
            </Form>
            <Divider />
            <p style={{ textAlign: "center" }}>
                Not a member yet? <Link to="/signup">Sign up</Link>
            </p>
        </Card>
    );
};



export default Login;

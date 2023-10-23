import React, { useState, useEffect, useContext } from "react";
import { Form, Input, Button, Typography, message, Divider, Card, Select } from "antd";
import axiosInstance from "src/authentication/axios.config";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "src/authentication/AuthProvider";


const { Title } = Typography;
const { Option } = Select;

function Signup() {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const { signup } = useContext(AuthContext);
    const [groups, setGroups] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get("/auth/groups/")
            .then(response => {
                setGroups(response.data);
            })
            .catch(error => {
                console.error("Failed to fetch groups:", error);
            });
    }, []);

    const onFinish = (values) => {
        setLoading(true);
        let userData = {
            first_name: values.first_name,
            last_name: values.last_name,
            email: values.email,
            password: values.password,
            password2: values.password2,
            group: values.group
        };
        signup(userData)
            .then(() => {
                setLoading(false);
                message.success("Signup successful.")
                navigate("/")
            })
            .catch((err) => {
                message.error("Sinup failed. Please try again.")
                setLoading(false);
            });
    }
    return (
        <Card style={{ maxWidth: 400, margin: "20px auto", padding: "20px" }}>
            <Title level={2} style={{ textAlign: "center" }}>
                Sign Up
            </Title>
            <Form
                form={form}
                name="register"
                onFinish={onFinish}
                scrollToFirstError
                layout="vertical"
            >
                <Form.Item
                    name="first_name"
                    label="First Name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your first name!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
    
                <Form.Item
                    name="last_name"
                    label="Last Name"
                    rules={[
                        {
                            required: true,
                            message: "Please input your last name!",
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
    
                <Form.Item
                    name="group"
                    label="Group"
                    rules={[{
                        required: true,
                        message: "Please select a group!",
                    }]}
                >
                    <Select placeholder="Select a group">
                        {groups.map(group => (
                            <Option key={group.id} value={group.id}>{group.name}</Option>
                        ))}
                    </Select>
                </Form.Item>
    
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
    
                <Form.Item
                    name="password2"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                        {
                            required: true,
                            message: "Please confirm your password!",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match!"));
                            },
                        }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
    
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
            <Divider />
            <p style={{ textAlign: "center" }}>
                Already have an account? <Link to="/login">Log In</Link>
            </p>
        </Card>
    );
};



export default Signup;

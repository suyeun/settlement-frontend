import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Checkbox } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const LogoImg = styled.img`
  width: 200px;
  margin-bottom: 36px;
  @media (max-width: 900px) {
    width: 120px;
    margin-bottom: 18px;
  }
`;

const LoginWrapper = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const CenterBox = styled.div`
  z-index: 2;
  width: 420px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 40px 40px 40px;
  border-radius: 24px;
  box-shadow: 0 8px 32px #00000014;
  @media (max-width: 900px) {
    width: 98vw;
    padding: 24px 8px 16px 8px;
    box-shadow: none;
    border-radius: 0;
  }
`;

const Logo = styled.div`
  font-family: 'Montserrat', 'Pretendard', 'Noto Sans KR', sans-serif;
  font-size: 48px;
  font-weight: 900;
  letter-spacing: 2px;
  color: #222;
  margin-bottom: 40px;
  text-align: center;
`;

const StyledForm = styled(Form)`
  width: 100%;
  .ant-form-item {
    margin-bottom: 18px;
  }
`;

const StyledInput = styled(Input)`
  height: 46px;
  border-radius: 10px;
  background: #f7f7f7;
  border: 1.5px solid #e0e0e0;
  font-size: 16px;
  box-shadow: 0 2px 8px #0000000A;
  &::placeholder {
    color: #bbb;
    font-size: 15px;
  }
  &:focus, &:active {
    border-color: #bdb300;
    box-shadow: 0 0 0 2px #fff20033;
    background: #fff;
  }
`;

const StyledPassword = styled(Input.Password)`
  height: 46px;
  border-radius: 10px;
  background: #f7f7f7;
  border: 1.5px solid #e0e0e0;
  font-size: 16px;
  box-shadow: 0 2px 8px #0000000A;
  & input::placeholder {
    color: #bbb;
    font-size: 15px;
  }
  &:focus-within {
    border-color: #bdb300;
    box-shadow: 0 0 0 2px #fff20033;
    background: #fff;
  }
`;

const StyledButton = styled(Button)`
  width: 100%;
  height: 46px;
  border-radius: 10px;
  background: #4d4700;
  color: #fff;
  font-size: 18px;
  font-weight: 700;
  border: none;
  margin-top: 6px;
  box-shadow: 0 2px 8px #0000000A;
  letter-spacing: 0.5px;
  &:hover, &:focus {
    background: #3a3500 !important;
    color: #fff !important;
  }
`;

const InfoText = styled.div`
  margin-top: 18px;
  color: #888;
  font-size: 13.5px;
  text-align: center;
  letter-spacing: 0.1px;
`;

const IllustLeft = styled.img`
  position: absolute;
  left: 0;
  bottom: 32px;
  width: 340px;
  z-index: 1;
  opacity: 0.85;
  pointer-events: none;
  @media (max-width: 900px) {
    width: 110px;
    bottom: 0;
    opacity: 0.4;
  }
`;

const IllustRight = styled.img`
  position: absolute;
  right: 0;
  bottom: 32px;
  width: 340px;
  z-index: 1;
  opacity: 0.85;
  pointer-events: none;
  @media (max-width: 900px) {
    width: 110px;
    bottom: 0;
    opacity: 0.4;
  }
`;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [rememberId, setRememberId] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    // 모든 쿠키 삭제
    document.cookie.split(';').forEach((c) => {
      document.cookie = c
        .replace(/^ +/, '')
        .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
    });
  }, []);

  React.useEffect(() => {
    const savedId = localStorage.getItem('rememberedId');
    if (savedId) {
      form.setFieldsValue({ username: savedId });
      setRememberId(true);
    }
  }, [form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await login(values.username, values.password);
      if (rememberId) {
        localStorage.setItem('rememberedId', values.username);
      } else {
        localStorage.removeItem('rememberedId');
      }
      message.success('로그인에 성공했습니다!');
      navigate('/dashboard');
    } catch (error: any) {
      message.error(error.response?.data?.message || '로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginWrapper>
      <IllustLeft src="/login-illust-left.png" alt="login illust left" />
      <IllustRight src="/login-illust-right.png" alt="login illust right" />
      <CenterBox>
        <LogoImg src="/catch12-logo.png" alt="CATCH12 logo" />
        <StyledForm form={form} name="login" onFinish={onFinish} autoComplete="off" size="large">
          <Form.Item name="username" rules={[{ required: true, message: '아이디 입력' }]}> 
            <StyledInput placeholder="아이디 입력" autoComplete="username" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '비밀번호 입력' }]}> 
            <StyledPassword placeholder="비밀번호 입력" autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Checkbox checked={rememberId} onChange={e => setRememberId(e.target.checked)} style={{ marginBottom: 8 }}>
              아이디 기억하기
            </Checkbox>
          </Form.Item>
          <Form.Item>
            <StyledButton type="primary" htmlType="submit" loading={loading}>
              로그인
            </StyledButton>
          </Form.Item>
        </StyledForm>
        <InfoText>등록된 고객사만 이용 가능합니다.</InfoText>
      </CenterBox>
    </LoginWrapper>
  );
};

export default Login; 
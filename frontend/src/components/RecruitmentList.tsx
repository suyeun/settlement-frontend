import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Input, Space, Upload, message, Row, Col, Card, Statistic } from 'antd';
import { SearchOutlined, UploadOutlined, ReloadOutlined, PrinterOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import axios from '../api';
import moment from 'moment';
import ReactToPrint from 'react-to-print';

interface Recruitment {
  id: number;
  settlementMonth: string;
  clientName: string;
  employeeCount: number;
  billingAmount: number;
  commission: number;
  commissionStandard: string;
  billingPeriod: string;
  depositDate: string | null;
  taxInvoiceDate: string | null;
  settlementCommission: number;
  settlementDate: string | null;
  note: string | null;
  createdAt: string;
}

interface RecruitmentResponse {
  data: Recruitment[];
  total: number;
  page: number;
  limit: number;
}

const RecruitmentList: React.FC = () => {
  const [recruitments, setRecruitments] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const printRef = useRef<HTMLDivElement>(null);

  const columns: ColumnsType<Recruitment> = [
    { title: '정산 월', dataIndex: 'settlementMonth', key: 'settlementMonth', width: 100 },
    { title: '거래처명', dataIndex: 'clientName', key: 'clientName', width: 120 },
    { title: '인원수', dataIndex: 'employeeCount', key: 'employeeCount', width: 80, render: (v) => v?.toLocaleString() },
    { title: '청구금액', dataIndex: 'billingAmount', key: 'billingAmount', width: 120, render: (v) => `₩${v?.toLocaleString()}` },
    { title: '수수료', dataIndex: 'commission', key: 'commission', width: 120, render: (v) => `₩${v?.toLocaleString()}` },
    { title: '수수료 지급기준', dataIndex: 'commissionStandard', key: 'commissionStandard', width: 120 },
    { title: '청구기간', dataIndex: 'billingPeriod', key: 'billingPeriod', width: 120 },
    { title: '입금일자', dataIndex: 'depositDate', key: 'depositDate', width: 100, render: (v) => v ? moment(v).format('YYYY-MM-DD') : '-' },
    { title: '세금계산서 발행일', dataIndex: 'taxInvoiceDate', key: 'taxInvoiceDate', width: 100, render: (v) => v ? moment(v).format('YYYY-MM-DD') : '-' },
    { title: '정산 수수료', dataIndex: 'settlementCommission', key: 'settlementCommission', width: 120, render: (v) => `₩${v?.toLocaleString()}` },
    { title: '정산일자', dataIndex: 'settlementDate', key: 'settlementDate', width: 100, render: (v) => v ? moment(v).format('YYYY-MM-DD') : '-' },
    { title: '비고', dataIndex: 'note', key: 'note', ellipsis: true, render: (v) => v || '-' },
  ];

  const fetchRecruitments = async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      const response = await axios.get<RecruitmentResponse>('/recruitments', { params });
      setRecruitments(response.data.data);
      setPagination({
        current: page,
        pageSize: limit,
        total: response.data.total,
      });
    } catch (error) {
      message.error('데이터를 불러오는데 실패했습니다.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruitments();
  }, []);

  const handleSearch = () => {
    fetchRecruitments(1, pagination.pageSize, searchText);
  };

  const handleTableChange = (pagination: any) => {
    fetchRecruitments(pagination.current, pagination.pageSize, searchText);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/recruitments/upload-csv',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 파일이 성공적으로 업로드되었습니다.`);
        fetchRecruitments();
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 파일 업로드에 실패했습니다.`);
      }
    },
    beforeUpload(file) {
      const isCsv = file.type === 'text/csv' || file.name.endsWith('.csv');
      if (!isCsv) {
        message.error('CSV 파일만 업로드 가능합니다!');
      }
      return isCsv;
    },
  };

  const totalAmount = recruitments.reduce((sum, item) => sum + (item.billingAmount || 0), 0);
  const totalCommission = recruitments.reduce((sum, item) => sum + (item.commission || 0), 0);

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="총 데이터 수" value={pagination.total} suffix="건" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="현재 페이지 총액" value={totalAmount} prefix="₩" formatter={(v) => v?.toLocaleString()} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="현재 페이지 수수료" value={totalCommission} prefix="₩" formatter={(v) => v?.toLocaleString()} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="업로드 상태" value="정상" valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input.Search
            placeholder="거래처명, 정산 월 등으로 검색"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onSearch={handleSearch}
            enterButton={<SearchOutlined />}
            allowClear
          />
        </Col>
        <Col span={12}>
          <Space style={{ float: 'right' }}>
            <Upload {...uploadProps} showUploadList={false}>
              <Button icon={<UploadOutlined />} type="primary">
                CSV 업로드
              </Button>
            </Upload>
            <Button icon={<ReloadOutlined />} onClick={() => fetchRecruitments(pagination.current, pagination.pageSize, searchText)}>
              새로고침
            </Button>
            <ReactToPrint
              trigger={() => <Button icon={<PrinterOutlined />}>출력</Button>}
              content={() => printRef.current}
              documentTitle="채용대행관리"
            />
          </Space>
        </Col>
      </Row>
      <div ref={printRef} style={{ background: '#fff', padding: 12, borderRadius: 8 }}>
        <Table
          columns={columns}
          dataSource={recruitments}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          size="small"
        />
      </div>
    </div>
  );
};

export default RecruitmentList; 
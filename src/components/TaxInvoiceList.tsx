import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space, Upload, message, Row, Col, Card, Statistic } from 'antd';
import { SearchOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import axios from '../api';
import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';

interface TaxInvoice {
  id: number;
  settlementMonth: string;
  companyCount: number;
  employeeCount: number;
  billingAmount: number;
  commission: number;
  depositDate: string | null;
  settlementCommission: number;
  settlementDate: string | null;
  note: string | null;
}

interface TaxInvoiceResponse {
  data: TaxInvoice[];
  total: number;
  page: number;
  limit: number;
}

const TaxInvoiceList: React.FC = () => {
  const [taxInvoices, setTaxInvoices] = useState<TaxInvoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const { user } = useAuth();

  const columns: ColumnsType<TaxInvoice> = [
    { title: '정산 월', dataIndex: 'settlementMonth', key: 'settlementMonth', width: 100, render: (v) => <b>{v}</b> },
    { title: '업체수', dataIndex: 'companyCount', key: 'companyCount', width: 80 },
    { title: '인원수', dataIndex: 'employeeCount', key: 'employeeCount', width: 80 },
    { title: '청구금액', dataIndex: 'billingAmount', key: 'billingAmount', width: 120, render: (v) => v ? v.toLocaleString() : '' },
    { title: '수수료', dataIndex: 'commission', key: 'commission', width: 120, render: (v) => v ? v.toLocaleString() : '' },
    { title: '입금일자', dataIndex: 'depositDate', key: 'depositDate', width: 100, render: (v) => v ? moment(v).format('M/D/YY') : '' },
    { title: '정산 수수료', dataIndex: 'settlementCommission', key: 'settlementCommission', width: 120, render: (v) => v ? v.toLocaleString() : '' },
    { title: '정산일자', dataIndex: 'settlementDate', key: 'settlementDate', width: 100, render: (v) => v ? moment(v).format('M/D/YY') : '' },
    { title: '비고', dataIndex: 'note', key: 'note', ellipsis: true },
  ];

  const fetchTaxInvoices = async (page = 1, limit = 10, search = '') => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      const response = await axios.get<TaxInvoiceResponse>('/tax-invoices', { params });
      setTaxInvoices(response.data.data);
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
    fetchTaxInvoices();
  }, []);

  const handleSearch = () => {
    fetchTaxInvoices(1, pagination.pageSize, searchText);
  };

  const handleTableChange = (pagination: any) => {
    fetchTaxInvoices(pagination.current, pagination.pageSize, searchText);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/tax-invoices/upload-csv',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 파일이 성공적으로 업로드되었습니다.`);
        fetchTaxInvoices();
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

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card>
            <Statistic title={`세금계산서 - ${user?.name || user?.username || ''}`} value={pagination.total} suffix="건" />
          </Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input.Search
            placeholder="정산 월, 비고 등으로 검색"
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
            <Button icon={<ReloadOutlined />} onClick={() => fetchTaxInvoices(pagination.current, pagination.pageSize, searchText)}>
              새로고침
            </Button>
          </Space>
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={taxInvoices}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
        }}
        onChange={handleTableChange}
        scroll={{ x: 1000 }}
        size="small"
      />
    </div>
  );
};

export default TaxInvoiceList; 
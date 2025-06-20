import React, { useState, useEffect } from 'react';
import { 
  Table, 
  Button, 
  Input, 
  Space, 
  Upload, 
  message, 
  DatePicker, 
  Row, 
  Col,
  Card,
  Statistic,
  Tag
} from 'antd';
import { SearchOutlined, UploadOutlined, ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { UploadProps } from 'antd';
import axios from '../api';
import moment from 'moment';

const { RangePicker } = DatePicker;

interface Settlement {
  id: number;
  settlementMonth: string;
  companyCount: number;
  employeeCount: number;
  billingAmount: number;
  commission: number;
  depositDate: string | null;
  settlementCommission: number;
  note: string | null;
  amount: number;
  settlementDate: string | null;
  createdAt: string;
}

interface SettlementResponse {
  data: Settlement[];
  total: number;
  page: number;
  limit: number;
}

const SettlementList: React.FC = () => {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const columns: ColumnsType<Settlement> = [
    {
      title: '정산 월',
      dataIndex: 'settlementMonth',
      key: 'settlementMonth',
      width: 100,
    },
    {
      title: '업체수',
      dataIndex: 'companyCount',
      key: 'companyCount',
      width: 80,
      render: (value) => value?.toLocaleString(),
    },
    {
      title: '인원수',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      width: 80,
      render: (value) => value?.toLocaleString(),
    },
    {
      title: '청구금액',
      dataIndex: 'billingAmount',
      key: 'billingAmount',
      width: 120,
      render: (value) => `₩${value?.toLocaleString()}`,
    },
    {
      title: '수수료',
      dataIndex: 'commission',
      key: 'commission',
      width: 120,
      render: (value) => `₩${value?.toLocaleString()}`,
    },
    {
      title: '입금일자',
      dataIndex: 'depositDate',
      key: 'depositDate',
      width: 100,
      render: (value) => value ? moment(value).format('YYYY-MM-DD') : '-',
    },
    {
      title: '정산 수수료',
      dataIndex: 'settlementCommission',
      key: 'settlementCommission',
      width: 120,
      render: (value) => `₩${value?.toLocaleString()}`,
    },
    {
      title: '금액',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (value) => `₩${value?.toLocaleString()}`,
    },
    {
      title: '정산일자',
      dataIndex: 'settlementDate',
      key: 'settlementDate',
      width: 100,
      render: (value) => value ? moment(value).format('YYYY-MM-DD') : '-',
    },
    {
      title: '비고',
      dataIndex: 'note',
      key: 'note',
      ellipsis: true,
      render: (value) => value || '-',
    },
  ];

  const fetchSettlements = async (page = 1, limit = 10, search = '', startDate = '', endDate = '') => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (search) params.search = search;
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      }

      const response = await axios.get<SettlementResponse>('/settlements', { params });
      setSettlements(response.data.data);
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
    fetchSettlements();
  }, []);

  const handleSearch = () => {
    fetchSettlements(1, pagination.pageSize, searchText);
  };

  const handleTableChange = (pagination: any) => {
    fetchSettlements(pagination.current, pagination.pageSize, searchText);
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: '/upload/csv',
    headers: {
      authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 파일이 성공적으로 업로드되었습니다.`);
        fetchSettlements(); // 리스트 새로고침
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

  const totalAmount = settlements.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalCommission = settlements.reduce((sum, item) => sum + (item.commission || 0), 0);

  return (
    <div>
      {/* 통계 카드 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="총 데이터 수"
              value={pagination.total}
              suffix="건"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="현재 페이지 총액"
              value={totalAmount}
              prefix="₩"
              formatter={(value) => value?.toLocaleString()}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="현재 페이지 수수료"
              value={totalCommission}
              prefix="₩"
              formatter={(value) => value?.toLocaleString()}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="업로드 상태"
              value="정상"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 검색 및 액션 바 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Input.Search
            placeholder="정산 월 또는 비고로 검색"
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
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => fetchSettlements(pagination.current, pagination.pageSize, searchText)}
            >
              새로고침
            </Button>
          </Space>
        </Col>
      </Row>

      {/* 테이블 */}
      <Table
        columns={columns}
        dataSource={settlements}
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

export default SettlementList; 
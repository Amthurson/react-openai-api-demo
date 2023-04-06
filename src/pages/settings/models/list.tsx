import { FC, useEffect, useState } from "react";
import { History } from "history";
import { getModelsList } from "@/apis/openai";
import { Space, Table, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

type Props = {
    location: Location;
    history: History;
}

interface PermissionType {
    allow_create_engine?: boolean;
    allow_fine_tuning?: boolean;
    allow_logprobs?: boolean;
    allow_sampling?: boolean;
    allow_search_indices?: boolean;
    allow_view?: boolean;
    created?: boolean;
    group?: any;
    id?: string;
    is_blocking?: boolean;
    object?: string;
    organization?: string;
}

interface DataType {
    key: string;
    created: string;
    id: string;
    owned_by: string | null;
    parent: string | null;
    permission?: PermissionType[];
    loading: boolean;
}

const ModelList: FC<Props> = (props: Props): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<DataType[]>([]);

    const pagination = {
        pageSize: 12
    }

    useEffect(()=>{
        getList()
    },[]);

    const getList = async () => {
        try {
            setLoading(true)
            if(data.length===0) {
                const models = await getModelsList();
                const {data} = models;
                setData(data.map(v=>({...v,key:v.id})));
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const columns: ColumnsType<DataType> = [
        {
          title: 'Id',
          dataIndex: 'id',
          key: 'id',
          render: (text) => <a>{text}</a>,
        },
        {
          title: 'Owned_by',
          dataIndex: 'owned_by',
          key: 'owned_by',
        },
        {
          title: 'Parent',
          dataIndex: 'parent',
          key: 'parent',
          render:(_,{parent}) => parent || '-'
        },
        {
          title: 'Permission',
          key: 'permission',
          dataIndex: 'permission',
          render: (_, { permission }) => (
            <>
              {permission && permission.length>0 && Object.entries(permission[0]).map(([key,value]) => {
                return typeof value === 'boolean' && value && (
                  <Tag color="geekblue" key={key}>
                    {key.toUpperCase()}
                  </Tag>
                );
              })}
            </>
          ),
        },
        {
          title: 'Created',
          dataIndex: 'created',
          key: 'created',
          render:(_,{created}) => dayjs(+created*1000).format("YYYY/MM/DD"),
          defaultSortOrder: 'descend',
          sorter: (a, b) => +a.created - +b.created
        },
        {
          title: 'Action',
          key: 'action',
          render: (_, record) => (
            <Space size="middle">
              <a>Use {record.id}</a>
            </Space>
          ),
        },
    ];

    return (
        <div>
            <Table loading={loading} pagination={pagination} columns={columns} dataSource={data} />
        </div>
    )
}
export default ModelList
import React, { useState } from "react";
import { ConfigProvider, Table } from "antd";
import moment from "moment";
import { Box } from "@chakra-ui/react";
import Layout from "../../views/Layouts";

const Withdrawals = () => {
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Code",
      dataIndex: "code",
      // sorter: (a, b) => a?.country.name.localeCompare(b?.country?.name),
      // render: (_, n) => {
      //   return <span>{n?.country?.name}</span>;
      // },
    },
    {
      title: "Business",
      dataIndex: "business",
    },
    {
      title: "Phone number",
      dataIndex: "phone",
    },
    {
      title: "Amount",
      dataIndex: "amount",
    },
    {
      title: "Transaction id",
      dataIndex: "transaction_id",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, n) => {
        return (
          <>
            {n?.status === 0 ? (
              <StatusTag
                text={"Approved"}
                className={"bg-green-500 text-white"}
              />
            ) : n?.status === 1 ? (
              <StatusTag
                text={"Pending"}
                className={"bg-yellow-400 text-gray-50"}
              />
            ) : (
              <StatusTag
                text={"Rejected"}
                className={"bg-red-500 text-gray-50"}
              />
            )}
          </>
        );
      },
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (_, n) => {
        return (
          <span>{moment(n?.createdAt).format("YYYY-MM-DD HH:mm:ss")}</span>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, n) => {
        return (
          <Box className="flex gap-1 justify-start">
            <ActionButton text={"Confirm"} className={"bg-success"} />
            <ActionButton className={"bg-red-600"} text={"Reject"} />
          </Box>
        );
      },
    },
  ];

  return (
    <Layout>
      <div className="text-md py-2 font-bold">WITHDRAWAL REQUESTS</div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#FFD600",
            colorPrimaryTextActive: "#19411D",
            colorPrimaryText: "#19411D",
            colorPrimaryBg: "#FFD600",
          },
        }}
      >
        <Table
          style={{ fontSize: "11px", marginTop: "10px", background: "white" }}
          rowKey={(data) => data.id}
          loading={loading}
          pagination={{
            defaultPageSize: 30,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "30", "50", "100"],
          }}
          columns={columns}
          dataSource={sample_data}
        />
      </ConfigProvider>
    </Layout>
  );
};

export default Withdrawals;

const ActionButton = ({ handleClick, text, className }) => (
  <button
    className={`text-sm py-1.5 px-3 rounded ${className} `}
    onClick={handleClick}
  >
    {text}
  </button>
);

const StatusTag = ({ handleClick, text, className }) => (
  <div
    className={`text-xs font-semibold rounded-full p-1 text-center  ${className} `}
  >
    {text}
  </div>
);

let sample_data = [
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 2,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 2,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 0,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 1,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 0,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 1,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 2,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 2,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 2,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 0,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 1,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 0,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 1,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 2,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
  {
    code: "pkrst7qv",
    amount: "1250",
    createdAt: new Date(),
    business: "Sarova Tech",
    status: 2,
    phone: "0790***387",
    transaction_id: "QWERTY123",
  },
];

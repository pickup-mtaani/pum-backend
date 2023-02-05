import React, { useCallback, useEffect, useState } from "react";
import { ConfigProvider, Popconfirm, Table } from "antd";
import moment from "moment";
import { Box, Button } from "@chakra-ui/react";
import Layout from "../../views/Layouts";
import withdrawalServices from "../../services/withdrawalServices";
import { toast } from "react-toastify";
const Withdrawals = () => {
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);

  const fetchWithdrawals = useCallback(async () => {
    try {
      setLoading(true);
      let withdraws = await withdrawalServices.fetchWithdrawals();
      console.log(withdraws);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Withdrawals fetch error: ", error?.message);
    }
  }, []);

  const handleReject = useCallback(async (id) => {
    try {
      setLoading(true);
      await withdrawalServices.updateWithdrawal(id, { status: "rejected" });

      setLoading(false);
      fetchWithdrawals();
      toast.success("Withdrawal rejected.");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Withdrawals fetch error: ", error?.message);
    }
  }, []);

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
      render: (_, n) => {
        return <span>{n?.business?.name}</span>;
      },
    },
    {
      title: "Phone number",
      dataIndex: "phone_number",
      render: (_, n) => {
        return (
          <span>
            {n?.phone_number?.substring(0, 4) +
              "***" +
              n?.phone_number?.substring(
                n?.phone_number?.length - 3,
                n?.phone_number?.length
              )}
          </span>
        );
      },
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
            {n?.status === "approved" ? (
              <StatusTag
                text={"Approved"}
                className={"bg-green-500 text-white"}
              />
            ) : n?.status === "pending" ? (
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
          <>
            {n?.status !== "rejected" && (
              <Box className="flex gap-1 justify-start">
                <ActionButton text={"Confirm"} className={"bg-success"} />
                <Popconfirm
                  title="Reject the withdrawal?"
                  description="Are you sure to reject this withdrawal?"
                  onConfirm={() => handleReject(n?._id)}
                  // onCancel={cancel}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ className: "bg-primary text-slate-800" }}
                >
                  <div>
                    <ActionButton className={"bg-red-600"} text={"Reject"} />
                  </div>
                </Popconfirm>
              </Box>
            )}
          </>
        );
      },
    },
  ];

  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

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
          dataSource={[]}
        />
      </ConfigProvider>
    </Layout>
  );
};

export default Withdrawals;

const ActionButton = ({ handleClick, text, className, ...rest }) => (
  <Button
    className={`text-sm py-1.5 px-3 rounded ${className} `}
    onClick={handleClick}
    {...rest}
  >
    {text}
  </Button>
);

const StatusTag = ({ handleClick, text, className }) => (
  <div
    className={`text-xs font-semibold rounded-full p-1 text-center  ${className} `}
  >
    {text}
  </div>
);

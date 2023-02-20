/* eslint-disable react-hooks/exhaustive-deps */
import { Box } from "@chakra-ui/react";
import { ConfigProvider, Table } from "antd";
import React, { useCallback, useState } from "react";
import { BiEdit } from "react-icons/bi";
import { FiPlus } from "react-icons/fi";
import { IoTrashOutline } from "react-icons/io5";
import { colors } from "../../../assets/Theme";
import UseCustomToast from "../../../hooks/useCustomToast";
import BkplServices from "../../../services/BkplServices";
import brandServices from "../../../services/BrandServices";
import countryServices from "../../../services/CountryServices";
import EmbpServices from "../../../services/EmbpServices";
import NkplServices from "../../../services/NkplServices";
import ActionButton from "../../general/ActionButton";
import Button from "../../general/Button";
import ConfirmModal from "../../general/ConfirmModal";
import OutlinedButton from "../../general/OutlinedButton";
import SearchInput from "../../general/SearchInput";
import AddDefaults from "../AddDefaults";

const Withdrawals = () => {
  const [showForm, setShowForm] = useState(false);
  const showToast = UseCustomToast();

  const [currentSub, setCurrentSub] = useState("nkpl");
  const [mode, setMode] = useState("create");
  const [current, setCurrent] = useState({});

  // const [models, setModels] = useState([]);

  const renderActions = (current) => (
    <Box className="flex gap-3 justify-start">
      <ActionButton
        handleClick={() => {
          setMode("update");
          setCurrent(current);
          setShowForm(true);
        }}
      >
        <BiEdit className="text-md text-dark_green" />
      </ActionButton>

      <ActionButton handleClick={() => {}}>
        <IoTrashOutline className="text-md text-dark_green" />
      </ActionButton>
    </Box>
  );

  const columns = [
    {
      title: "Business",
      dataIndex: "business",
    //   sorter: (a, b) =>
    //     a?.vehicle_brand?.vehicle_brand_name.localeCompare(b?.name),
    //   render: (_, n) => {
    //     return <span>{n?.vehicle_brand?.vehicle_brand_name}</span>;
    //   },
    },
    {
      title: "Packages",
      dataIndex: "packages",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      width: 120,
      render: (_, n) =>
        renderActions(n, async () => {
          NkplServices.del();
        }),
    },
  ];



  return (
    <>
      <div className="flex">
        <SearchInput placeholder="search user" />
      </div>

      <div className="flex justify-between items-center mb-2 mt-2">
        <div className={"flex gap-2"}>
          
        </div>

        <Button
          text={`Add  ${
            currentSub === "nkpl" ? "NKPL & P" : currentSub?.toUpperCase()
          }`}
          icon={<FiPlus className="text-xl" />}
          handleClick={() => setShowForm(true)}
        />
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colors.primary,
            colorPrimaryTextActive: "#19411D",
            colorPrimaryText: "#19411D",
            colorPrimaryBg: colors.primary,
          },
        }}
      >
        <Table
          style={{ fontSize: "11px" }}
          rowKey={(data) => data.id}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ["10", "15", "20", "30"],
          }}
          columns={
            columns
          }
          dataSource={
           []
          }
        />
      </ConfigProvider>

     
    </>
  );
};

export default Withdrawals;

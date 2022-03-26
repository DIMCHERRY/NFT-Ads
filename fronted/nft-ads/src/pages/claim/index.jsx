import React, { useState, useEffect } from "react";
import BurnModal from "../../components/BurnModal";
import { get } from "../../network";
import { Pagination, Card, Avatar, Spin, Popover, message, Empty } from "antd";
import { CalendarOutlined, TwitterOutlined, BlockOutlined } from "@ant-design/icons";
import { useWallet } from "../../hooks/useWallet";
import { handleError, handleAddress } from "../../util/util";
import dayjs from "dayjs";

import "./index.css";

const { Meta } = Card;

const INITIAL_PAGE = 1;
const INITIAL_PAGE_SIZE = 8;

const Claim = () => {
  const { walletState } = useWallet();
  const { address, isLogin } = walletState;
  const [dropList, setDropList] = useState([]);
  const [page, setPage] = useState(INITIAL_PAGE);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(INITIAL_PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [isBurnModalVisible, setIsBurnModalVisible] = useState(false);

  const clickToBurn = () => {
    setIsBurnModalVisible(true);
  };
  const handleBurnModalClose = () => {
    setIsBurnModalVisible(false);
  };
  const postTwitter = () => {
    window.open(
      "https://twitter.com/intent/tweet?text=Requesting%20faucet%20funds%20into%200x0000000000000000000000000000000000000000%20on%20the%20%23Rinkeby%20%23Ethereum%20test%20network.",
      "_blank"
    );
  };

  const getDropList = async (page, pageSize, address) => {
    if (!address) {
      message.warning("need login");
    }
    try {
      setLoading(true);
      const { data } = await get(`/api/tokens/all/page/${page}/pageSize/${pageSize}/`);
      const { total = 0, tokens = [] } = data;
      setTotal(total);
      setDropList(tokens);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!address || !isLogin) {
      return;
    }
    getDropList(INITIAL_PAGE, INITIAL_PAGE_SIZE, address);
  }, [address, isLogin]);

  return (
    <Spin spinning={loading}>
      <div className="drop-list-container">
        {dropList.map((item) => (
          <Card
            className="drop-list-card-wrapper"
            key={item.tokenId}
            cover={<img alt={item.tokenId} src={item.imgUrl} className="drop-record-img" />}
            actions={[
              <Popover content={`create at ${dayjs(item.createAt).format("YYYY-MM-DD HH:mm:ss")}`}>
                <CalendarOutlined key="calendar" />
              </Popover>,
              <Popover content={"post twitter"}>
                <TwitterOutlined key="twitter" onClick={postTwitter} />
              </Popover>,
              <BlockOutlined key="block" onClick={clickToBurn} />
            ]}
          >
            <Meta
              avatar={<Avatar src="/favicon.png" />}
              title={handleAddress(item.address)}
              description={
                <Popover
                  content={<div className="drop-list-description-detail">{item.description}</div>}
                  placement="topLeft"
                >
                  <div className="drop-list-description">{item.description}</div>
                </Popover>
              }
            />
          </Card>
        ))}
      </div>
      {dropList.length > 0 ? (
        <div className="drop-list-pagination">
          <Pagination
            showSizeChanger
            current={page}
            total={total}
            pageSize={pageSize}
            pageSizeOptions={[4, 8, 12, 16, 20]}
            onChange={(page, pageSize) => {
              setPage(page);
              setPageSize(pageSize);
              getDropList(page, pageSize, address);
            }}
          />
        </div>
      ) : (
        <Empty />
      )}
      <BurnModal isModalVisible={isBurnModalVisible} handleClose={handleBurnModalClose} />
    </Spin>
  );
};

export default Claim;

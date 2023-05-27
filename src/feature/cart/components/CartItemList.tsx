import { useQuery } from "react-query";
import { getCartItemById } from "../../../data/URL/server/cartRoute";
import CartItemElem from "./CartItemElem";
import { NotifyMessage } from "../../../components/atom/lodaing/Error";
import { CartItemType } from "../types/cartItemsType";
import { axiosPrivate } from "../../../lib/api/axios";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "../../../context/recoil/atom/user";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { useMemo } from "react";

const CartItemList = () => {
  const { userId } = useRecoilValue(userInfoAtom);
  const { data } = useQuery<CartItemType[]>(["Cartitems", userId], () =>
    axiosPrivate.get(getCartItemById).then(({ data }) => data)
  );
  const totalPrice = useMemo(() => {
    return data!.reduce((acc, cur) => {
      return cur.itemInfo.price + acc;
    }, 0);
  }, [data]);
  const totalQuantity = useMemo(() => {
    return data!.reduce((acc, cur) => {
      return cur.quantity + acc;
    }, 0);
  }, [data]);

  return (
    <>
      <div css={width100}>
        {data!.length !== 0 ? (
          data!.map((cartItem, i) => (
            <CartItemElem data={cartItem} key={cartItem.itemInfo._id + i} />
          ))
        ) : (
          <NotifyMessage message="장바구니가 비었습니다"></NotifyMessage>
        )}
      </div>
      <TotalPrice>{`총 ${totalQuantity}개, 총가격 : ${totalPrice.toLocaleString()}원`}</TotalPrice>
    </>
  );
};

export default CartItemList;

const width100 = css`
  width: 100%;
  height: calc(100vh - 76px);
  padding: 60px;
  overflow-y: scroll;
`;

const TotalPrice = styled.div`
  width: 100%;
  border: 1px solid var(--line-gray);
  padding: 16px;
  height: 60px;
  position: fixed;
  background-color: var(--pure-white);
  bottom: 0px;
  left: 0;
  text-align: end;
  font-size: var(--h3);
`;

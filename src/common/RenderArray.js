import React from 'react';
import Loader from './loader/Loader';
/*props == {
	loading?: boolean;
	items: any[];
	renderItem: (value: any, index?: number, array?: any[]) => any;
	Fallback?: ReactElement;
} */
export const RenderArray = (props) => {
  const { loading = false, items, renderItem, Fallback } = props;
  if (loading) {
    return <Loader></Loader>;
  } else {
    const noData = Fallback ? Fallback : <div>No Data Found</div>;
    if (!items?.length) {
      return noData;
    } else {
      return items?.map(renderItem) ?? noData;
    }
  }
};

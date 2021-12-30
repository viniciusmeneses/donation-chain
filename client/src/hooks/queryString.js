import { useMemo, useCallback } from 'react';

import queryString from 'query-string';

import { useLocation, useNavigate } from 'react-router-dom';

const useQueryString = () => {
	const location = useLocation();
	const navigate = useNavigate();

	const params = useMemo(
		() => queryString.parse(location.search),
		[location.search]
	);

	const setParams = useCallback(
		params => navigate(`?${queryString.stringify(params)}`),
		[navigate]
	);

	return [params, setParams];
};

export default useQueryString;

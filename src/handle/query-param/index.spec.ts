import { queryParamHandle as handle } from ".";
import { EQueryParam, EPrefillAction } from './type';

describe('Query Parameters Handle', () => {
    const { EDIT, ADD_HOST, ADD_PATH } = EPrefillAction;
    const { HOST_ID, HOST_URL, PATH_ID, PATH } = EQueryParam;

    describe('Method - createEditParam', () => {
        it('should return empty string when host id is not provied', () => {
            const mockRuleIdCtx: any = {};

            const param = handle.createEditParam(mockRuleIdCtx);
            expect(param).toBe('');
        });

        it('should return param when host id is provided', () => {
            const mockHostId = 'host';

            const param = handle.createEditParam({ hostId: mockHostId });
            expect(param).toBe(`?action=${EDIT}&${HOST_ID}=${mockHostId}`);
        });

        it('should return param when host id and path id is provided', () => {
            const mockHostId = 'host';
            const mockPathId = 'path';

            const param = handle.createEditParam({
                hostId: mockHostId,
                pathId: mockPathId,
            });
            expect(param).toBe(`?action=${EDIT}&${HOST_ID}=${mockHostId}&${PATH_ID}=${mockPathId}`);
        });
    });

    describe('Method - createAddHostParam', () => {
        it('should return empty string when host url is not provided', () => {
            const mockHostUrl = '';

            const param = handle.createAddHostParam(mockHostUrl);
            expect(param).toBe('');
        });

        it('should return param when host url is provided', () => {
            const mockHostUrl = 'host';

            const param = handle.createAddHostParam(mockHostUrl);
            expect(param).toBe(`?action=${ADD_HOST}&${HOST_URL}=${mockHostUrl}`);
        });
    });

    describe('Method - createAddPathParam', () => {
        const mockHostId = 'host';
        const mockPath = 'path';

        it('should return empty string when either host Id or path is not provided', () => {
            expect(handle.createAddPathParam(mockHostId, '')).toBe('');
            expect(handle.createAddPathParam('', mockPath)).toBe('');
            expect(handle.createAddPathParam('', '')).toBe('');
        });

        it('should return param when host url is provided', () => {
            const param = handle.createAddPathParam(mockHostId, mockPath);
            expect(param).toBe(`?action=${ADD_PATH}&${HOST_ID}=${mockHostId}&${PATH}=${mockPath}`);
        });
    });
});
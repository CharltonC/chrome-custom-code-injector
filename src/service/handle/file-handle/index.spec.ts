import { TestUtil } from '../../../asset/ts/test-util';
import { FileHandle } from '.';
import { TMethodSpy } from '../../../asset/ts/test-util/type';

describe('File Handle', () => {
    let handle: FileHandle;
    let spy: TMethodSpy<FileHandle>;
    let Url;

    beforeEach(() => {
        handle = new FileHandle();
        spy = TestUtil.spyMethods(handle);

        // Implement dummy methods which dont exist in JEST
        Url = URL || webkitURL;
        Url.createObjectURL = jest.fn();
        Url.revokeObjectURL = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.restoreAllMocks();
    });

    describe('Method - readJson: Read json file content (as object)', () => {
        const mockFile = {} as File;
        let mockOnError: jest.Mock;

        beforeEach(() => {
            mockOnError = jest.fn();
        });

        it('should trigger `onError` callback when there is error', async () => {
            spy.readFile.mockImplementation(() => {
                throw new Error('error');
            });
            await handle.readJson(mockFile, mockOnError);
            expect(mockOnError).toHaveBeenCalled();
        });

        it('should return resolve promise when there is no error', async () => {
            const mockData = {lorem: 'sum'};
            spy.readFile.mockImplementation((file, resolve) => resolve(mockData));
            const data = await handle.readJson(mockFile, mockOnError);
            expect(data).toEqual(mockData);
            expect(mockOnError).not.toHaveBeenCalled();
        });
    });

    describe('Method - saveJson: Save Json via download', () => {
        const mockFileName = 'demo';
        const mockData = {lorem: 'sum'};
        const mockBlobData = { xyz: 123 };
        const mockBlobDataUrl = 'loremsum';
        let mockClick: jest.Mock;
        let BlobSpy;

        beforeEach(() => {
            BlobSpy = jest.spyOn(global, 'Blob' as any);
            BlobSpy.mockImplementation(() => mockBlobData);

            mockClick = jest.fn();
            spy.createAnchorElem.mockReturnValue({
                click: mockClick
            });

            Url.createObjectURL.mockReturnValue(mockBlobDataUrl);
        });

        it('should save json', () => {
            handle.saveJson(mockData, mockFileName);

            expect(mockClick).toHaveBeenCalled();
            expect(Url.createObjectURL).toHaveBeenCalledWith(mockBlobData);
            expect(Url.revokeObjectURL).toHaveBeenCalledWith(mockBlobDataUrl);
        });
    });

    describe('Method - readFile: Read a file', () => {
        const mockFile = {};
        const mockCallback = () => {};
        let addEvtSpy: jest.SpyInstance;
        let readAsTextSpy: jest.SpyInstance;

        beforeEach(() => {
            addEvtSpy = jest.spyOn(FileReader.prototype, 'addEventListener');
            addEvtSpy.mockImplementation(() => {});

            readAsTextSpy = jest.spyOn(FileReader.prototype, 'readAsText');
            readAsTextSpy.mockImplementation(() => {});

            spy.onFileLoad.mockImplementation(() => {});
        });

        it('should read file', () => {
            handle.readJson(mockFile as File, mockCallback);

            expect(spy.onFileLoad).toHaveBeenCalled();
            expect(addEvtSpy).toHaveBeenCalledTimes(2);
            expect(readAsTextSpy).toHaveBeenCalledWith(mockFile);
        });
    });

    describe('Method - onFileLoad: file loaded handler', () => {
        it('should return a on file load handler function', () => {
            const mockJsonData = { lorem: 123 };
            const mockCallback = jest.fn();
            const mockEvt = {
                target: {
                    result: { lorem: 'sum' },
                    removeEventListener: jest.fn()
                }
            };
            jest.spyOn(JSON, 'parse').mockReturnValue(mockJsonData);

            const onFileLoad = handle.onFileLoad(mockCallback)
            onFileLoad(mockEvt);

            expect(mockCallback).toHaveBeenCalledWith(mockJsonData);
            expect(mockEvt.target.removeEventListener).toHaveBeenCalledWith('load', onFileLoad);
        });
    });

    describe('Method - onFileError: file error handler', () => {
        it('should throw error', () => {
            const mockErr = new Error('lorem');
            const mockEvt: any = {
                target: { error: mockErr }
            };

            expect(() => {
                handle.onFileError(mockEvt);
            }).toThrowError(mockErr);
        });
    });

    describe('Method - createAnchorElem: create an anchor element for file download', () => {
        const mockBlobUrl = '';
        const mockFileName = 'demo';
        const mockDateStr = '2000';

        beforeEach(() => {
            jest
                .spyOn(document, 'createElement')
                .mockReturnValue({} as HTMLElement);

            jest
                .spyOn(handle, 'dateStr', 'get')
                .mockImplementation(() => mockDateStr);
        });

        it('should return anchor element without date string', () => {
            expect(handle.createAnchorElem(mockBlobUrl, mockFileName)).toEqual({
                href: mockBlobUrl,
                target: '_blank',
                download: `${mockFileName}.json`
            });
        });

        it('should return anchor element with date string', () => {
            expect(handle.createAnchorElem(mockBlobUrl, mockFileName, true)).toEqual({
                href: mockBlobUrl,
                target: '_blank',
                download: `${mockFileName}_${mockDateStr}.json`
            });
        });
    });

    describe('Getter Prop - dateStr: Create today`s date as a string', () => {
        const mockDate = 12;
        const mockMth = 3;
        const mockYr = 2000;

        beforeEach(() => {
            jest.spyOn(global, 'Date').mockReturnValue({
                getDate: () => mockDate,
                getMonth: () => mockMth,
                getFullYear: () => mockYr,
            } as any);
        });

        it('should return date string', () => {
            expect(handle.dateStr).toBe(`${mockYr}0${mockMth+1}${mockDate}`);
        });
    });

    describe('Getter Prop - Url', () => {
        it('should return either `URL` if it is defined', () => {
            (window as any).URL = {};
            (window as any).webkitURL = null;
            expect(handle.Url).toBe(URL);
        });

        it('should return either `webkitURL` if it is defined', () => {
            (window as any).URL = null;
            (window as any).webkitURL = {};
            expect(handle.Url).toBe(webkitURL);
        });
    });
});

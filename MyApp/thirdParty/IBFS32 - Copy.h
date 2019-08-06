#include <windows.h>
#pragma comment(lib, "IBFS32.lib")

#ifdef __cplusplus
extern "C" {
#endif

//TMex datatypes
//--------------
//short		        16 bit signed integer
//long		        32 bit signed integer
//char		        8 bit signed number
//unsigned char	    8 bit unsigned number
//far pascal		far function using pascal calling convention
//void far *		generic far pointer
//short far *		far pointer to a 16 bit signed integer

using uchar = unsigned char;

// session
long far pascal TMExtendedStartSession(short, short, void far *);
short far pascal TMValidSession(long);
short far pascal TMEndSession(long);
short far pascal Get_Version(char far *);
// file_operations
// short far pascal TMFirstFile(long, void far *, FileEntry far *);
// short far pascal TMNextFile(long, void far *, FileEntry far *);
// short far pascal TMOpenFile(long, void far *, FileEntry far *);
// short far pascal TMCreateFile(long, void far *, short far *, FileEntry far *);
short far pascal TMCloseFile(long, void far *, short);
short far pascal TMReadFile(long, void far *, short, uchar far *, short);
short far pascal TMWriteFile(long, void far *, short, uchar far *, short);
// short far pascal TMDeleteFile(long, void far *, FileEntry far *);
short far pascal TMFormat(long, void far *);
// short far pascal TMAttribute(long, void far *, short, FileEntry far *);
// short far pascal TMReNameFile(long, void far *, short, FileEntry far *);
// short far pascal TMChangeDirectory(long, void far *, short, DirectoryPath far *);
// short far pascal TMDirectoryMR(long, void far *, short, FileEntry far *);
short far pascal TMCreateProgramJob(long, void far *);
short far pascal TMDoProgramJob(long, void far *);
short far pascal TMWriteAddFile(long, void far *, short, short, short, uchar far *, short);
// short far pascal TMTerminateAddFile(long, void far *, FileEntry far *);
// transport
short far pascal TMReadPacket(long, void far *, short, uchar far *, short);
short far pascal TMWritePacket(long, void far *, short, uchar far *, short);
short far pascal TMBlockIO(long, uchar far *, short);
short far pascal TMExtendedReadPage(long, void far *, short, uchar far *, short);
short far pascal TMProgramByte(long, void far *, short, short, short, short far *, short);
// network
short far pascal TMSkipFamily(long, void far *);
short far pascal TMFamilySearchSetup(long, void far *, short);
short far pascal TMFirst(long, void far *);
short far pascal TMNext(long, void far *);
short far pascal TMAccess(long, void far *);
short far pascal TMOverAccess(long, void far *);
short far pascal TMStrongAccess(long, void far *);
short far pascal TMStrongAlarmAccess(long, void far *);
short far pascal TMRom(long, void far *, short far *);
short far pascal TMFirstAlarm(long, void far *);
short far pascal TMNextAlarm(long, void far *);
short far pascal TMAutoOverDrive(long, void far *, short);
short far pascal TMSetup(long);
short far pascal TMTouchByte(long, short);
short far pascal TMTouchReset(long);
short far pascal TMTouchBit(long, short);
short far pascal TMClose(long);
short far pascal TMProgramPulse(long);
short far pascal TMOneWireCom(long, short, short);
short far pascal TMOneWireLevel(long, short, short, short);
short far pascal TMGetTypeVersion(short, char far *);
short far pascal TMBlockStream(long, uchar far *, short);

// enum class TMErrors : int
// {
//     NO_DEVICE = -1,
//     WRONG_TYPE = -2,
//     FILE_READ_ERR = -3,
//     BUFFER_TOO_SMALL = -4,
//     HANDLE_NOT_AVAIL = -5,
//     FILE_NOT_FOUND = -6,
//     REPEAT_FILE = -7,
//     HANDLE_NOT_USED = -8,
//     FILE_WRITE_ONLY = -9,
//     OUT_OF_SPACE = -10,
//     FILE_WRITE_ERR = -11,
//     //FILE_READ_ONLY = -12,
//     FUNC_NOT_SUP = -13,
//     BAD_FILENAME = -14,
//     CANT_DEL_READ_ONLY = -15,
//     HANDLE_NOT_EXIST = -16,
//     ONE_WIRE_PORT_ERROR = -17,
//     INVALID_DIRECTORY = -18,
//     DIRECTORY_NOT_EMPTY = -19,
//     UNABLE_TO_CREATE_DIR = -20,
//     NO_PROGRAM_JOB = -21,
//     PROGRAM_WRITE_PROTECT = -22,
//     NON_PROGRAM_PARTS = -23,
//     ADDFILE_TERMINATED = -24,
//     TIMEOUT = -25,
//     INVALID_ARGUMENT = -26,
//     BAD_ACK = -27,
//     INVALID_SESSION = -200,

//     NO_BASDRV_FOUND = -201
// };

#ifdef __cplusplus
}
#endif

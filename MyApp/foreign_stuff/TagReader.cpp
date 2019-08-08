#include "TagReader.h"
#include "../thirdParty/IBFS32.h"
#include <vector>
#include <algorithm>

#pragma comment(lib, "IBFS32.lib")

long sessionHandle = 0;
void * sessionBuffer;
long TagReaderC::Aquire()
{
    sessionBuffer = new CHAR[512];
    sessionHandle = TMExtendedStartSession(2, 5, nullptr);
    return sessionHandle;
	// return 55;
}

std::string TagReaderC::GetTag()
{
    //short arr [8];
    std::vector<short> arr(8);
    TMRom(sessionHandle, sessionBuffer, &arr.front());
    std::string res;
    res.reserve(3*8);
    std::for_each(begin(arr), end(arr), [&res](auto&& i) {
        char buffer[3] = {};
        std::snprintf(buffer, 3, "%x02", i);
        res += buffer;
    } );
    return res;
}

Napi::Number TagReaderC::AquireWrapped(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    long value = TagReaderC::Aquire();
    return Napi::Number::New(env, value);
}

Napi::String TagReaderC::GetTagWrapped(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    std::string value = TagReaderC::GetTag();
    return Napi::String::New(env, value);
}

Napi::Object TagReaderC::Init(Napi::Env env, Napi::Object exports)
{
    exports.Set("aquire", Napi::Function::New(env, TagReaderC::AquireWrapped));
    exports.Set("getTag", Napi::Function::New(env, TagReaderC::GetTagWrapped));
    return exports;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
    return TagReaderC::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
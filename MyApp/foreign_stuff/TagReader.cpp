#include <sstream>
#include "TagReader.h"
#include "../thirdParty/IBFS32.h"
#include <vector>
#include <algorithm>

#pragma comment(lib, "IBFS32.lib")

 

long sessionHandle = 0;

long TagReaderC::Aquire()
{
    sessionHandle = TMExtendedStartSession(2, 5, nullptr);

    short result = TMSetup(sessionHandle);

    return sessionHandle;
}

long TagReaderC::ReleaseTag()
{
    return TMEndSession(sessionHandle);
}

std::string TagReaderC::GetTag()
{
    short result;
    result = TMTouchReset(sessionHandle);

    unsigned char state_buffer[15360];
    short ROM[8];
    result = TMFirst(sessionHandle, state_buffer);
    if (result == 1)
    {
        char out[100];
        ROM[0] = 0;
        result = TMRom(sessionHandle, state_buffer, ROM);
        if (result == 1)
        {
            //Value on tag  :a100000eb4b43d01
            //value returned from the device : 013db4b40e0000a1
            sprintf_s(out, "shorts: %0.2x %0.2x %0.2x %0.2x %0.2x %0.2x %0.2x %0.2x \n", ROM[0], ROM[1], ROM[2], ROM[3], ROM[4], ROM[5], ROM[6], ROM[7]);
            std::ostringstream stm ;
            stm << out ;
            return stm.str();
        }
        else
        {
            return "TMRom Failed." + std::to_string(result);
        }
    }
    return "TMFirst Failed." + std::to_string(result);
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

Napi::Number TagReaderC::ReleaseTagWrapped(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    long value = TagReaderC::ReleaseTag();
    return Napi::Number::New(env, value);
}

Napi::Object TagReaderC::Init(Napi::Env env, Napi::Object exports)
{
    exports.Set("aquire", Napi::Function::New(env, TagReaderC::AquireWrapped));
    exports.Set("getTag", Napi::Function::New(env, TagReaderC::GetTagWrapped));
    exports.Set("releaseTag", Napi::Function::New(env, TagReaderC::ReleaseTagWrapped));
    return exports;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
    return TagReaderC::Init(env, exports);
}


NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
#include "TagReader.h"
#include "../thirdParty/IBFS32.h"

//#pragma (lib, "IBFS32.lib")

long TagReaderC::Aquire()
{
    return TMExtendedStartSession(2,5, nullptr);
    //return 1234;
}

Napi::Number TagReaderC::AquireWrapped(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();
    long value = TagReaderC::Aquire();
    return Napi::Number::New(env, value);
}

Napi::Object TagReaderC::Init(Napi::Env env, Napi::Object exports)
{ 
    exports.Set("aquire", Napi::Function::New(env, TagReaderC::AquireWrapped));
    return exports;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports)
{
    return TagReaderC::Init(env, exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME , InitAll)
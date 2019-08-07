#include <windows.h>
#include <napi.h>

namespace TagReaderC {
  long Aquire();
  std::string GetTag();
  Napi::Number AquireWrapped(const Napi::CallbackInfo& info);
  Napi::String GetTagWrapped(const Napi::CallbackInfo& info);
  Napi::Object Init(Napi::Env env, Napi::Object exports);
}
#include "BindingExample.h"

std::string BindingExamples::hello()
{
  return "Hello World";
}

int BindingExamples::add(int a,int b)
{
  return a+b;
}

Napi::String BindingExamples::HelloWrapped(const Napi::CallbackInfo& info) 
{
  Napi::Env env = info.Env();
  Napi::String returnValue = Napi::String::New(env, BindingExamples::hello());
  
  return returnValue;
}

Napi::Number  BindingExamples::AddWrapped(const Napi::CallbackInfo& info) 
{
   Napi::Env env = info.Env();
    if (info.Length() < 2 || !info[0].IsNumber() || !info[1].IsNumber()) {
        Napi::TypeError::New(env, "Number expected").ThrowAsJavaScriptException();
    } 

    Napi::Number first = info[0].As<Napi::Number>();
    Napi::Number second = info[1].As<Napi::Number>();

    int returnValue = BindingExamples::add(first.Int32Value(), second.Int32Value());
    
    return Napi::Number::New(env, returnValue);
}


Napi::Object BindingExamples::Init(Napi::Env env, Napi::Object exports)
{
  exports.Set("hello", Napi::Function::New(env, BindingExamples::HelloWrapped));
  exports.Set("addNumbers", Napi::Function::New(env, BindingExamples::AddWrapped));
  return exports;
}

Napi::Object InitAll(Napi::Env env, Napi::Object exports) {
  return BindingExamples::Init(env,exports);
}

NODE_API_MODULE(NODE_GYP_MODULE_NAME, InitAll)
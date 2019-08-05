{
  "targets": [
    {
      "target_name": "native",
      "sources": [
        "foreign_stuff/BindingExample.h",
        "foreign_stuff/BindingExample.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")",
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")",
      ],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_CPP_EXCEPTIONS"]
    }
  ]
}
{
  "targets": [
    {
      "target_name": "native",
      "sources": [
        # "foreign_stuff/BindingExample.h",
        # "foreign_stuff/BindingExample.cpp",
        "foreign_stuff/TagReader.h",
        "foreign_stuff/TagReader.cpp"
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'link_settings': {
        'library_dirs': ['thirdParty/IBFS32/x86'],  # cruncher.cc does math.
      },
      "dependencies": [
        "<!(node -p \"require('node-addon-api').gyp\")",
      ],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exceptions"],
      "defines": ["NAPI_CPP_EXCEPTIONS"],
      'msvs_settings': {
      'VCLinkerTool': {
        'ImageHasSafeExceptionHandlers': 'false',
      },
    },
 
    }
  ]
}

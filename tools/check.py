#!/usr/bin/env python


try:
  import os;
  #import pysox;
except ImportError:
  print 'requires pysox module';
  sys.exit();

import sys

try:
  filename1 = sys.argv[1];
  filename2 = sys.argv[2];
except:
  print 'requires two valid audio filenmames as parameters';
  sys.exit();

print 'Assembling files: ' + filename1 + ' and ' + filename2;

sys.exit();


#!/usr/bin/env python
import os
import sys

try:
  import pysox;
except ImportError:
  print 'requires pysox module';
  sys.exit()

def assemble(file1,file2):
        try:
          filename1 = file1
          filename2 = file2
        except:
          print 'requires two valid audio filenmames as parameters'
          sys.exit()

        print 'Assembling files: ' + filename1 + ' and ' + filename2

	id = pysox.ConcatenateFiles('input',[filename1,filename2])
        outfile = pysox.CSoxStream('output.wav','w',id.get_out_signal())
        chain = pysox.CEffectsChain(ostream=outfile)
        chain.add_effect(id)
        chain.flow_effects()
        print('DONE!')
        outfile.close()

def main(argv):
  if len(argv) != 3:
      sys.exit(1);

  file1 = argv.pop(1)
  if not os.path.isfile(file1):
                sys.exit(1);

  file2 = argv.pop()
  if not os.path.isfile(file2):
                sys.exit(1);

  return assemble(file1,file2)

if __name__ == '__main__':
  sys.exit(main(sys.argv))


sys.exit();


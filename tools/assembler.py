#!/usr/bin/env python
import os
import sys

try:
  import pysox;
except ImportError:
  print 'requires pysox module';
  sys.exit()

def assemble(files):
	outdir = '/var/www/pex.openbroadcaster.pro/www/modules/programs/tools/output.wav'
        print files
	id = pysox.ConcatenateFiles('input',files)
        outfile = pysox.CSoxStream( outdir,'w',id.get_out_signal())
        chain = pysox.CEffectsChain(ostream=outfile)
        chain.add_effect(id)
        chain.flow_effects()
        print('DONE!')
        outfile.close()

def main(argv):
  if len(argv) <=2:
      sys.exit(1);
  com = argv.pop(0)
  return assemble(argv)

if __name__ == '__main__':
  sys.exit(main(sys.argv))


sys.exit();

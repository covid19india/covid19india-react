import copy from 'rollup-plugin-copy';

export default {
  input: './src/placeholder.js',
  plugins: [
    copy({
      targets: [
        {
          src: 'public/projected_maps/*.json',
          dest: 'build/mini_maps',
          transform: (contents) => JSON.stringify(JSON.parse(contents)),
        },
      ],
    }),
  ],
};
